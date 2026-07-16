<?php

namespace App\Enums;

enum CrimeStatus: string
{
    case Reported = 'reported';
    case Verified = 'verified';
    case Dismissed = 'dismissed';
}
