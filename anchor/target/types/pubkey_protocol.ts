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
      "name": "communityCreate",
      "discriminator": [
        239,
        98,
        233,
        247,
        133,
        17,
        28,
        82
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
          "name": "config",
          "writable": true
        },
        {
          "name": "communityAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
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
              "name": "communityCreateArgs"
            }
          }
        }
      ]
    },
    {
      "name": "communityProviderDisable",
      "discriminator": [
        231,
        252,
        155,
        46,
        28,
        138,
        137,
        185
      ],
      "accounts": [
        {
          "name": "community",
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
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "communityProviderDisableArgs"
            }
          }
        }
      ]
    },
    {
      "name": "communityProviderEnable",
      "discriminator": [
        238,
        250,
        31,
        188,
        71,
        157,
        134,
        177
      ],
      "accounts": [
        {
          "name": "community",
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
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "communityProviderEnableArgs"
            }
          }
        }
      ]
    },
    {
      "name": "communitySignerAdd",
      "discriminator": [
        34,
        232,
        190,
        181,
        19,
        13,
        141,
        229
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
              "name": "communitySignerAddArgs"
            }
          }
        }
      ]
    },
    {
      "name": "communitySignerRemove",
      "discriminator": [
        94,
        107,
        113,
        213,
        95,
        68,
        166,
        195
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
              "name": "communitySignerRemoveArgs"
            }
          }
        }
      ]
    },
    {
      "name": "communityUpdateAuthorityApprove",
      "discriminator": [
        60,
        211,
        14,
        245,
        160,
        250,
        55,
        11
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
      "name": "communityUpdateAuthorityDecline",
      "discriminator": [
        189,
        132,
        120,
        231,
        150,
        179,
        232,
        108
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
      "name": "communityUpdateAuthorityRequest",
      "discriminator": [
        95,
        207,
        17,
        53,
        8,
        64,
        249,
        252
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
              "name": "communityUpdateAuthorityRequestArgs"
            }
          }
        }
      ]
    },
    {
      "name": "communityUpdateDetails",
      "discriminator": [
        132,
        155,
        197,
        35,
        84,
        189,
        100,
        216
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
      "name": "configInit",
      "discriminator": [
        13,
        236,
        164,
        173,
        106,
        253,
        164,
        185
      ],
      "accounts": [
        {
          "name": "config",
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
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
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
              "name": "configInitArgs"
            }
          }
        }
      ]
    },
    {
      "name": "profileAuthorityAdd",
      "discriminator": [
        60,
        2,
        107,
        19,
        25,
        126,
        252,
        248
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
              "name": "profileAuthorityAddArgs"
            }
          }
        }
      ]
    },
    {
      "name": "profileAuthorityRemove",
      "discriminator": [
        107,
        162,
        170,
        103,
        144,
        101,
        63,
        237
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
              "name": "profileAuthorityRemoveArgs"
            }
          }
        }
      ]
    },
    {
      "name": "profileCreate",
      "discriminator": [
        119,
        211,
        42,
        30,
        71,
        78,
        152,
        201
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
              "name": "profileCreateArgs"
            }
          }
        }
      ]
    },
    {
      "name": "profileUpdateDetails",
      "discriminator": [
        157,
        158,
        155,
        130,
        206,
        93,
        40,
        61
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
      "name": "verifyProfileIdentity",
      "discriminator": [
        179,
        83,
        99,
        171,
        14,
        91,
        192,
        133
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
          "name": "pointer"
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "verifyProfileIdentityArgs"
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
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
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
      "name": "cannotRemoveLastAuthority",
      "msg": "Cannot remove last remaining authority"
    },
    {
      "code": 6001,
      "name": "cannotRemoveSolanaProvider",
      "msg": "Cannot remove the Solana provider"
    },
    {
      "code": 6002,
      "name": "communityVerificationAlreadyExists",
      "msg": "Community verification already exists"
    },
    {
      "code": 6003,
      "name": "invalidAccountOwner",
      "msg": "Account not owned by program"
    },
    {
      "code": 6004,
      "name": "accountTooLarge",
      "msg": "Account too large"
    },
    {
      "code": 6005,
      "name": "authorityAlreadyExists",
      "msg": "Authority already exists"
    },
    {
      "code": 6006,
      "name": "authorityNonExistent",
      "msg": "Authority does not exist"
    },
    {
      "code": 6007,
      "name": "invalidAvatarUrl",
      "msg": "Invalid Avatar Url"
    },
    {
      "code": 6008,
      "name": "invalidCommunityAuthority",
      "msg": "Invalid Community Authority"
    },
    {
      "code": 6009,
      "name": "invalidDiscordId",
      "msg": "Invalid Discord ID"
    },
    {
      "code": 6010,
      "name": "invalidDiscordUrl",
      "msg": "Invalid Discord URL"
    },
    {
      "code": 6011,
      "name": "invalidFarcasterId",
      "msg": "Invalid Farcaster ID"
    },
    {
      "code": 6012,
      "name": "invalidFarcasterUrl",
      "msg": "Invalid Farcaster URL"
    },
    {
      "code": 6013,
      "name": "invalidFeePayer",
      "msg": "Invalid Fee payer"
    },
    {
      "code": 6014,
      "name": "invalidGitHubId",
      "msg": "Invalid GitHub ID"
    },
    {
      "code": 6015,
      "name": "invalidGitHubUrl",
      "msg": "Invalid GitHub URL"
    },
    {
      "code": 6016,
      "name": "invalidGoogleId",
      "msg": "Invalid Google ID"
    },
    {
      "code": 6017,
      "name": "invalidGoogleUrl",
      "msg": "Invalid Google URL"
    },
    {
      "code": 6018,
      "name": "invalidName",
      "msg": "Invalid Name"
    },
    {
      "code": 6019,
      "name": "invalidProviderIdTooLong",
      "msg": "Invalid Provider ID (too long)"
    },
    {
      "code": 6020,
      "name": "invalidProviderIdNotFound",
      "msg": "Invalid Provider ID (not found)"
    },
    {
      "code": 6021,
      "name": "invalidProviderNameTooLong",
      "msg": "Invalid Provider Name (too long)"
    },
    {
      "code": 6022,
      "name": "invalidSlug",
      "msg": "Invalid Slug"
    },
    {
      "code": 6023,
      "name": "invalidSolanaPubKey",
      "msg": "Invalid Solana Public Key"
    },
    {
      "code": 6024,
      "name": "invalidTelegramId",
      "msg": "Invalid Telegram ID"
    },
    {
      "code": 6025,
      "name": "invalidTelegramUrl",
      "msg": "Invalid Telegram URL"
    },
    {
      "code": 6026,
      "name": "invalidUsername",
      "msg": "Invalid Username"
    },
    {
      "code": 6027,
      "name": "invalidWebsiteUrl",
      "msg": "Invalid Website URL"
    },
    {
      "code": 6028,
      "name": "invalidXid",
      "msg": "Invalid X ID"
    },
    {
      "code": 6029,
      "name": "invalidXurl",
      "msg": "Invalid X URL"
    },
    {
      "code": 6030,
      "name": "identityProfileInvalid",
      "msg": "Invalid Identity Profile Authority"
    },
    {
      "code": 6031,
      "name": "identityAlreadyExists",
      "msg": "Identity already exists"
    },
    {
      "code": 6032,
      "name": "identityNonExistent",
      "msg": "Identity does not exist"
    },
    {
      "code": 6033,
      "name": "maxSizeReached",
      "msg": "Array reached max size"
    },
    {
      "code": 6034,
      "name": "providerAlreadyExists",
      "msg": "Provider already exists"
    },
    {
      "code": 6035,
      "name": "providerDoesNotExist",
      "msg": "Provider does not exist"
    },
    {
      "code": 6036,
      "name": "signerAlreadyExists",
      "msg": "Signer already exists"
    },
    {
      "code": 6037,
      "name": "signerDoesNotExist",
      "msg": "Signer does not exist"
    },
    {
      "code": 6038,
      "name": "signerRequired",
      "msg": "At least one signer is required"
    },
    {
      "code": 6039,
      "name": "unAuthorized",
      "msg": "Account unauthorized to perform this action"
    },
    {
      "code": 6040,
      "name": "unauthorizedCommunityAction",
      "msg": "Unauthorized community action"
    },
    {
      "code": 6041,
      "name": "unAuthorizedCommunityAuthority",
      "msg": "Account is not defined in config.community_authority"
    }
  ],
  "types": [
    {
      "name": "addIdentityArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "provider",
            "type": {
              "defined": {
                "name": "identityProvider"
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
            "name": "signers",
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
                  "name": "identityProvider"
                }
              }
            }
          },
          {
            "name": "discord",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "farcaster",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "github",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "telegram",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "website",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "x",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    },
    {
      "name": "communityCreateArgs",
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
      "name": "communityProviderDisableArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "provider",
            "type": {
              "defined": {
                "name": "identityProvider"
              }
            }
          }
        ]
      }
    },
    {
      "name": "communityProviderEnableArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "provider",
            "type": {
              "defined": {
                "name": "identityProvider"
              }
            }
          }
        ]
      }
    },
    {
      "name": "communitySignerAddArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "communitySignerRemoveArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "communityUpdateAuthorityRequestArgs",
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
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "communityAuthority",
            "type": "pubkey"
          },
          {
            "name": "configAuthority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "configInitArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "communityAuthority",
            "type": "pubkey"
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
                "name": "identityProvider"
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
      "name": "identityProvider",
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
                "name": "identityProvider"
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
      "name": "profileAuthorityAddArgs",
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
      "name": "profileAuthorityRemoveArgs",
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
      "name": "profileCreateArgs",
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
      "name": "removeIdentityArgs",
      "type": {
        "kind": "struct",
        "fields": [
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
            "name": "discord",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "farcaster",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "github",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "name",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "telegram",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "website",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "x",
            "type": {
              "option": "string"
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
      "name": "verifyProfileIdentityArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "provider",
            "type": {
              "defined": {
                "name": "identityProvider"
              }
            }
          },
          {
            "name": "providerId",
            "type": "string"
          }
        ]
      }
    }
  ]
};
