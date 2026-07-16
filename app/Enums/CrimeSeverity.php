<?php

namespace App\Enums;

enum CrimeSeverity: string
{
    case Safe = 'safe';
    case Moderate = 'moderate';
    case High = 'high';
    case Danger = 'danger';
}
