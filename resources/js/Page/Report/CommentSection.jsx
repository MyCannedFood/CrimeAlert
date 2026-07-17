import React, { useState, useEffect } from 'react';
import { MessageSquare, Reply, Trash2, Clock } from 'lucide-react';
import { api } from '../../utils/api';
import { supabase } from '../../utils/supabase';

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Baru saja';
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('id-ID');
}

function CommentForm({ reportId, parentId, onSubmit, onCancel, placeholder }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await api.comments.create(reportId, content.trim(), parentId);
      setContent('');
      if (onSubmit) onSubmit();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder || 'Tulis komentar...'}
        rows={3}
        maxLength={1000}
        className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {submitting ? 'Mengirim...' : 'Kirim'}
        </button>
      </div>
    </form>
  );
}

function CommentThread({ comment, reportId, children, onRefresh, currentUserId }) {
  const [showReply, setShowReply] = useState(false);
  const depth = comment._depth || 0;
  const isDeleted = !!comment.deleted_at;

  const handleDelete = async () => {
    if (!confirm('Hapus komentar ini?')) return;
    const ok = await api.comments.destroy(comment.id);
    if (ok && onRefresh) onRefresh();
  };

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-slate-200 dark:border-slate-700' : ''}`}>
      <div className="group py-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {comment.username?.split('@')[0] || 'Warga'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(comment.created_at)}
          </span>
          {isDeleted && (
            <span className="text-xs text-slate-400 dark:text-slate-500 italic">[dihapus]</span>
          )}
        </div>
        {isDeleted ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 italic">
            Komentar ini telah dihapus.
          </p>
        ) : (
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {comment.content}
          </p>
        )}
        {!isDeleted && (
          <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {currentUserId && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                <Reply className="w-3 h-3" />
                Balas
              </button>
            )}
            {currentUserId && comment.user_id === currentUserId && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Hapus
              </button>
            )}
          </div>
        )}

        {showReply && (
          <div className="mt-2">
            <CommentForm
              reportId={reportId}
              parentId={comment.id}
              onSubmit={() => { setShowReply(false); if (onRefresh) onRefresh(); }}
              onCancel={() => setShowReply(false)}
              placeholder="Tulis balasan..."
            />
          </div>
        )}
      </div>

      {children && children.length > 0 && (
        <div>
          {children.map((child) => (
            <CommentThread
              key={child.id}
              comment={child}
              reportId={reportId}
              children={child._children}
              onRefresh={onRefresh}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function buildThread(comments) {
  const map = {};
  const roots = [];

  comments.forEach((c) => {
    map[c.id] = { ...c, _children: [], _depth: 0 };
  });

  comments.forEach((c) => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id]._children.push(map[c.id]);
    } else if (!c.parent_id) {
      roots.push(map[c.id]);
    }
  });

  function setDepth(nodes, depth) {
    nodes.forEach((n) => {
      n._depth = depth;
      if (n._children.length) setDepth(n._children, depth + 1);
    });
  }
  setDepth(roots, 0);

  return roots;
}

export default function CommentSection({ reportId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [newComment, setNewComment] = useState(false);

  const loadComments = async () => {
    if (!reportId) return;
    setLoading(true);
    try {
      const data = await api.comments.list(reportId);
      console.log('Comments loaded:', data);
      setComments(data || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [reportId]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('CommentSection auth session:', session?.user?.id);
      setUser(session?.user ?? null);
    });
  }, []);

  const thread = buildThread(comments);

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          Komentar ({comments.length})
        </h3>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg ml-6" />
          <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
      ) : (
        <>
          {user ? (
            <div className="mb-6">
              {newComment || comments.length === 0 ? (
                <CommentForm
                  reportId={reportId}
                  onSubmit={() => { setNewComment(false); loadComments(); }}
                  onCancel={comments.length > 0 ? () => setNewComment(false) : undefined}
                  placeholder="Tulis komentar..."
                />
              ) : (
                <button
                  onClick={() => setNewComment(true)}
                  className="w-full py-3 px-4 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-left transition-colors cursor-pointer"
                >
                  Tulis komentar...
                </button>
              )}
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-center">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                Silakan masuk terlebih dahulu untuk berkomentar.
              </p>
            </div>
          )}

          {thread.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
              Belum ada komentar. Jadilah yang pertama!
            </p>
          ) : (
            <div className="space-y-1">
              {thread.map((comment) => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  reportId={reportId}
                  children={comment._children}
                  onRefresh={loadComments}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
