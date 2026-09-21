<?php

return [

    'paths' => ['api/*'],

    'allowed_headers' => ['*'],

    'allowed_origins' => [
        'https://traoremodibobintou-source.github.io',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Content-Type',
        'Accept',
        'Origin',
        'Authorization',
    ],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
