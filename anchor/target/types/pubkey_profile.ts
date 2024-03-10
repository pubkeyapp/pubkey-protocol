export type PubkeyProfile = {
  "version": "0.1.0",
  "name": "pubkey_profile",
  "instructions": [
    {
      "name": "createProfile",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "CreateProfileArgs"
          }
        }
      ]
    },
    {
      "name": "updateAvatarUrl",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateAvatarUrlArgs"
          }
        }
      ]
    },
    {
      "name": "addAuthority",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "AddAuthorityArgs"
          }
        }
      ]
    },
    {
      "name": "removeAuthority",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "RemoveAuthorityArgs"
          }
        }
      ]
    },
    {
      "name": "addIdentity",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "AddIdentityArgs"
          }
        }
      ]
    },
    {
      "name": "removeIdentity",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "RemoveIdentityArgs"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "pointer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
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
            "name": "avatarUrl",
            "type": "string"
          },
          {
            "name": "authorities",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "identities",
            "type": {
              "vec": {
                "defined": "Identity"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AddIdentityArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "RemoveIdentityArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "AddAuthorityArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "CreateProfileArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "RemoveAuthorityArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "UpdateAvatarUrlArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "Identity",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "provider",
            "type": "string"
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UnAuthorized",
      "msg": "Account unauthorized to perform this action"
    }
  ]
};

export const IDL: PubkeyProfile = {
  "version": "0.1.0",
  "name": "pubkey_profile",
  "instructions": [
    {
      "name": "createProfile",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "CreateProfileArgs"
          }
        }
      ]
    },
    {
      "name": "updateAvatarUrl",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateAvatarUrlArgs"
          }
        }
      ]
    },
    {
      "name": "addAuthority",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "AddAuthorityArgs"
          }
        }
      ]
    },
    {
      "name": "removeAuthority",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "RemoveAuthorityArgs"
          }
        }
      ]
    },
    {
      "name": "addIdentity",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "AddIdentityArgs"
          }
        }
      ]
    },
    {
      "name": "removeIdentity",
      "accounts": [
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "RemoveIdentityArgs"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "pointer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
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
            "name": "avatarUrl",
            "type": "string"
          },
          {
            "name": "authorities",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "identities",
            "type": {
              "vec": {
                "defined": "Identity"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AddIdentityArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "RemoveIdentityArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "AddAuthorityArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "CreateProfileArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "RemoveAuthorityArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "UpdateAvatarUrlArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "Identity",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "provider",
            "type": "string"
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UnAuthorized",
      "msg": "Account unauthorized to perform this action"
    }
  ]
};
