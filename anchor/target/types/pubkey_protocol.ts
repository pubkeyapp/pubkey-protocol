/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/pubkey_protocol.json`.
 */
export type PubkeyProtocol = {
  "address": "PUBKEYsiC4c87gFa5qGcH7t6VobVu3A4QqPUA2wzvam",
  "metadata": {
    "name": "pubkeyProtocol",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addIdentity",
      "discriminator": [
        212,
        100,
        104,
        34,
        15,
        136,
        248,
        225
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "profile.username",
                "account": "profile"
              }
            ]
          }
        },
        {
          "name": "pointer",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true,
          "relations": [
            "profile"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "addIdentityArgs"
            }
          }
        }
      ]
    },
    {
      "name": "addProfileAuthority",
      "discriminator": [
        193,
        106,
        183,
        12,
        216,
        250,
        151,
        31
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "profile.username",
                "account": "profile"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true,
          "relations": [
            "profile"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "addAuthorityArgs"
            }
          }
        }
      ]
    },
    {
      "name": "cancelUpdateCommunityAuthority",
      "discriminator": [
        35,
        173,
        125,
        89,
        189,
        117,
        252,
        233
      ],
      "accounts": [
        {
          "name": "community",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  117,
                  110,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "community.slug",
                "account": "community"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "createCommunity",
      "discriminator": [
        203,
        214,
        176,
        194,
        13,
        207,
        22,
        60
      ],
      "accounts": [
        {
          "name": "community",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  117,
                  110,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "args.slug"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createCommunityArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createProfile",
      "discriminator": [
        225,
        205,
        234,
        143,
        17,
        186,
        50,
        220
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "args.username"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createProfileArgs"
            }
          }
        }
      ]
    },
    {
      "name": "finalizeUpdateCommunityAuthority",
      "discriminator": [
        124,
        226,
        211,
        212,
        102,
        247,
        120,
        101
      ],
      "accounts": [
        {
          "name": "community",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  117,
                  110,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "community.slug",
                "account": "community"
              }
            ]
          }
        },
        {
          "name": "newAuthority",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "initiateUpdateCommunityAuthority",
      "discriminator": [
        30,
        152,
        215,
        7,
        192,
        28,
        143,
        39
      ],
      "accounts": [
        {
          "name": "community",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  117,
                  110,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "community.slug",
                "account": "community"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initiateUpdateAuthorityArgs"
            }
          }
        }
      ]
    },
    {
      "name": "removeAuthority",
      "discriminator": [
        242,
        104,
        208,
        132,
        190,
        250,
        74,
        216
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "profile.username",
                "account": "profile"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true,
          "relations": [
            "profile"
          ]
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "removeAuthorityArgs"
            }
          }
        }
      ]
    },
    {
      "name": "removeIdentity",
      "discriminator": [
        146,
        93,
        160,
        7,
        61,
        138,
        181,
        113
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "profile.username",
                "account": "profile"
              }
            ]
          },
          "relations": [
            "pointer"
          ]
        },
        {
          "name": "pointer",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true,
          "relations": [
            "profile"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "removeIdentityArgs"
            }
          }
        }
      ]
    },
    {
      "name": "updateCommunityDetails",
      "discriminator": [
        147,
        202,
        232,
        110,
        107,
        125,
        130,
        125
      ],
      "accounts": [
        {
          "name": "community",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  117,
                  110,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "community.slug",
                "account": "community"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "community"
          ]
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateCommunityDetailsArgs"
            }
          }
        }
      ]
    },
    {
      "name": "updateCommunityFeepayers",
      "discriminator": [
        252,
        235,
        116,
        149,
        213,
        20,
        3,
        12
      ],
      "accounts": [
        {
          "name": "community",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  109,
                  117,
                  110,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "community.slug",
                "account": "community"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "community"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateFeePayersArgs"
            }
          }
        }
      ]
    },
    {
      "name": "updateProfileDetails",
      "discriminator": [
        218,
        18,
        64,
        5,
        242,
        160,
        11,
        38
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  107,
                  101,
                  121,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "profile.username",
                "account": "profile"
              }
            ]
          }
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true,
          "relations": [
            "profile"
          ]
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateProfileDetailsArgs"
            }
          }
        }
      ]
    },
    {
      "name": "verifyProfileForCommunity",
      "discriminator": [
        155,
        142,
        189,
        98,
        130,
        121,
        248,
        118
      ],
      "accounts": [
        {
          "name": "community",
          "writable": true
        },
        {
          "name": "profile",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "verifyProfileForCommunityArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "community",
      "discriminator": [
        192,
        73,
        211,
        158,
        178,
        81,
        19,
        112
      ]
    },
    {
      "name": "pointer",
      "discriminator": [
        31,
        144,
        159,
        52,
        95,
        134,
        207,
        237
      ]
    },
    {
      "name": "profile",
      "discriminator": [
        184,
        101,
        165,
        188,
        95,
        63,
        127,
        188
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unAuthorized",
      "msg": "Account unauthorized to perform this action"
    },
    {
      "code": 6001,
      "name": "invalidFeePayer",
      "msg": "Invalid Fee payer"
    },
    {
      "code": 6002,
      "name": "invalidUsername",
      "msg": "Invalid Username"
    },
    {
      "code": 6003,
      "name": "invalidName",
      "msg": "Invalid Name"
    },
    {
      "code": 6004,
      "name": "invalidSlug",
      "msg": "Invalid Slug"
    },
    {
      "code": 6005,
      "name": "invalidAvatarUrl",
      "msg": "Invalid Avatar Url"
    },
    {
      "code": 6006,
      "name": "invalidXurl",
      "msg": "Invalid X (Twitter) URL"
    },
    {
      "code": 6007,
      "name": "invalidDiscordUrl",
      "msg": "Invalid Discord URL"
    },
    {
      "code": 6008,
      "name": "invalidFarcasterUrl",
      "msg": "Invalid Farcaster URL"
    },
    {
      "code": 6009,
      "name": "invalidGoogleUrl",
      "msg": "Invalid Google URL"
    },
    {
      "code": 6010,
      "name": "invalidGitHubUrl",
      "msg": "Invalid GitHub URL"
    },
    {
      "code": 6011,
      "name": "invalidSolanaPubKey",
      "msg": "Invalid Solana Public Key"
    },
    {
      "code": 6012,
      "name": "invalidTelegramUrl",
      "msg": "Invalid Telegram URL"
    },
    {
      "code": 6013,
      "name": "invalidWebsiteUrl",
      "msg": "Invalid Website URL"
    },
    {
      "code": 6014,
      "name": "invalidProviderId",
      "msg": "Invalid Provider ID"
    },
    {
      "code": 6015,
      "name": "invalidProviderName",
      "msg": "Invalid Provider Name"
    },
    {
      "code": 6016,
      "name": "invalidAccountOwner",
      "msg": "Account not owned by program"
    },
    {
      "code": 6017,
      "name": "authorityAlreadyExists",
      "msg": "Authority already exists"
    },
    {
      "code": 6018,
      "name": "authorityNonExistent",
      "msg": "Authority does not exist"
    },
    {
      "code": 6019,
      "name": "cannotRemoveSoloAuthority",
      "msg": "Cannot remove last remaining authority"
    },
    {
      "code": 6020,
      "name": "maxSizeReached",
      "msg": "Array reached max size"
    },
    {
      "code": 6021,
      "name": "identityAlreadyExists",
      "msg": "Identity already exists"
    },
    {
      "code": 6022,
      "name": "identityNonExistent",
      "msg": "Identity does not exist"
    },
    {
      "code": 6023,
      "name": "unauthorizedCommunityAction",
      "msg": "Unauthorized community action"
    },
    {
      "code": 6024,
      "name": "communityVerificationAlreadyExists",
      "msg": "Community verification already exists"
    },
    {
      "code": 6025,
      "name": "accountTooLarge",
      "msg": "Account too large"
    }
  ],
  "types": [
    {
      "name": "addAuthorityArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newAuthority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "addIdentityArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "provider",
            "type": {
              "defined": {
                "name": "pubKeyIdentityProvider"
              }
            }
          },
          {
            "name": "providerId",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "community",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "slug",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "avatarUrl",
            "type": "string"
          },
          {
            "name": "feePayers",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "pendingAuthority",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "providers",
            "type": {
              "vec": {
                "defined": {
                  "name": "pubKeyIdentityProvider"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "createCommunityArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slug",
            "type": "string"
          },
          {
            "name": "avatarUrl",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "createProfileArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "avatarUrl",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "identity",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "provider",
            "type": {
              "defined": {
                "name": "pubKeyIdentityProvider"
              }
            }
          },
          {
            "name": "providerId",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "communities",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "initiateUpdateAuthorityArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newAuthority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "pointer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "provider",
            "type": {
              "defined": {
                "name": "pubKeyIdentityProvider"
              }
            }
          },
          {
            "name": "providerId",
            "type": "string"
          },
          {
            "name": "profile",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "profile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "avatarUrl",
            "type": "string"
          },
          {
            "name": "feePayer",
            "type": "pubkey"
          },
          {
            "name": "authorities",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "identities",
            "type": {
              "vec": {
                "defined": {
                  "name": "identity"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "pubKeyIdentityProvider",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "discord"
          },
          {
            "name": "farcaster"
          },
          {
            "name": "github"
          },
          {
            "name": "google"
          },
          {
            "name": "solana"
          },
          {
            "name": "telegram"
          },
          {
            "name": "x"
          },
          {
            "name": "website"
          }
        ]
      }
    },
    {
      "name": "removeAuthorityArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authorityToRemove",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "removeIdentityArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "provider",
            "type": {
              "defined": {
                "name": "pubKeyIdentityProvider"
              }
            }
          },
          {
            "name": "providerId",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "updateCommunityDetailsArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "avatarUrl",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "name",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    },
    {
      "name": "updateFeePayersArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newFeePayers",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "updateProfileDetailsArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "newName",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "newAvatarUrl",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    },
    {
      "name": "verifyProfileForCommunityArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "providerId",
            "type": {
              "defined": {
                "name": "pubKeyIdentityProvider"
              }
            }
          }
        ]
      }
    }
  ]
};
