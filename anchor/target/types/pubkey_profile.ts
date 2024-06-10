/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/pubkey_profile.json`.
 */
export type PubkeyProfile = {
  "address": "PPLxwat1miBwyQHq5afxLzdXyAMG4jPp6981yQA5hyb",
  "metadata": {
    "name": "pubkeyProfile",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addAuthority",
      "discriminator": [
        229,
        9,
        106,
        73,
        91,
        213,
        109,
        183
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
                  102,
                  105,
                  108,
                  101
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
                  102,
                  105,
                  108,
                  101
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
                  102,
                  105,
                  108,
                  101
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
              "name": "createProfileArgs"
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
                  102,
                  105,
                  108,
                  101
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
                  102,
                  105,
                  108,
                  101
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
      "name": "updateAvatarUrl",
      "discriminator": [
        38,
        181,
        69,
        190,
        47,
        43,
        175,
        13
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
                  102,
                  105,
                  108,
                  101
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
              "name": "updateAvatarUrlArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
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
      "name": "invalidAvatarUrl",
      "msg": "Invalid Avatar Url"
    },
    {
      "code": 6004,
      "name": "invalidProviderId",
      "msg": "Invalid Provider ID"
    },
    {
      "code": 6005,
      "name": "invalidName",
      "msg": "Invalid Name"
    },
    {
      "code": 6006,
      "name": "invalidAccountOwner",
      "msg": "Account not owned by program"
    },
    {
      "code": 6007,
      "name": "authorityAlreadyExists",
      "msg": "Authority already exists"
    },
    {
      "code": 6008,
      "name": "authorityNonExistent",
      "msg": "Authority does not exist"
    },
    {
      "code": 6009,
      "name": "cannotRemoveSoloAuthority",
      "msg": "Cannot remove last remaining authority"
    },
    {
      "code": 6010,
      "name": "maxSizeReached",
      "msg": "Array reached max size"
    },
    {
      "code": 6011,
      "name": "identityAlreadyExists",
      "msg": "Identity already exists"
    },
    {
      "code": 6012,
      "name": "identityNonExistent",
      "msg": "Identity does not exist"
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
            "name": "nickname",
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
            "name": "solana"
          },
          {
            "name": "github"
          },
          {
            "name": "google"
          },
          {
            "name": "twitter"
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
            "name": "providerId",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "updateAvatarUrlArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "newAvatarUrl",
            "type": "string"
          }
        ]
      }
    }
  ]
};
