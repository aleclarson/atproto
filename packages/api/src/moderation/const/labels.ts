/** this doc is generated by ./scripts/code/labels.mjs **/
import { LabelDefinitionMap } from '../types'

export const LABELS: LabelDefinitionMap = {
  '!hide': {
    id: '!hide',
    preferences: ['hide'],
    flags: ['no-override'],
    onwarn: 'blur',
    groupId: 'system',
    configurable: false,
    strings: {
      settings: {
        en: {
          name: 'Moderator Hide',
          description: 'Moderator has chosen to hide the content.',
        },
      },
      account: {
        en: {
          name: 'Content Blocked',
          description: 'This account has been hidden by the moderators.',
        },
      },
      content: {
        en: {
          name: 'Content Blocked',
          description: 'This content has been hidden by the moderators.',
        },
      },
    },
  },
  '!no-promote': {
    id: '!no-promote',
    preferences: ['hide'],
    flags: [],
    onwarn: null,
    groupId: 'system',
    configurable: false,
    strings: {
      settings: {
        en: {
          name: 'Moderator Filter',
          description: 'Moderator has chosen to filter the content from feeds.',
        },
      },
      account: {
        en: {
          name: 'N/A',
          description: 'N/A',
        },
      },
      content: {
        en: {
          name: 'N/A',
          description: 'N/A',
        },
      },
    },
  },
  '!warn': {
    id: '!warn',
    preferences: ['warn'],
    flags: [],
    onwarn: 'blur',
    groupId: 'system',
    configurable: false,
    strings: {
      settings: {
        en: {
          name: 'Moderator Warn',
          description:
            'Moderator has chosen to set a general warning on the content.',
        },
      },
      account: {
        en: {
          name: 'Content Warning',
          description:
            'This account has received a general warning from moderators.',
        },
      },
      content: {
        en: {
          name: 'Content Warning',
          description:
            'This content has received a general warning from moderators.',
        },
      },
    },
  },
  'dmca-violation': {
    id: 'dmca-violation',
    preferences: ['hide'],
    flags: ['no-override'],
    onwarn: 'blur',
    groupId: 'legal',
    configurable: false,
    strings: {
      settings: {
        en: {
          name: 'Copyright Violation',
          description: 'The content has received a DMCA takedown request.',
        },
      },
      account: {
        en: {
          name: 'Copyright Violation',
          description:
            'This account has received a DMCA takedown request. It will be restored if the concerns can be resolved.',
        },
      },
      content: {
        en: {
          name: 'Copyright Violation',
          description:
            'This content has received a DMCA takedown request. It will be restored if the concerns can be resolved.',
        },
      },
    },
  },
  ncii: {
    id: 'ncii',
    preferences: ['hide'],
    flags: ['no-override'],
    onwarn: 'blur',
    groupId: 'legal',
    configurable: false,
    strings: {
      settings: {
        en: {
          name: 'Non-Consensual Intimate Image Abuse',
          description:
            'The content has been reported for sharing nudity or sexual imagery without the explicit consent of the individual(s) depicted.',
        },
      },
      account: {
        en: {
          name: 'Non-Consensual Intimate Image Abuse',
          description:
            'This account has been reported for sharing nudity or sexual imagery without the explicit consent of the individual(s) depicted. The report is currently under review.',
        },
      },
      content: {
        en: {
          name: 'Non-Consensual Intimate Image Abuse',
          description:
            'This content has been reported for displaying nudity or sexual imagery without the explicit consent of the individual(s) depicted. The report is currently under review.',
        },
      },
    },
  },
  doxxing: {
    id: 'doxxing',
    preferences: ['hide'],
    flags: ['no-override'],
    onwarn: 'blur',
    groupId: 'legal',
    configurable: false,
    strings: {
      settings: {
        en: {
          name: 'Doxxing',
          description:
            'Information that reveals private information about someone which has been shared without the consent of the subject.',
        },
      },
      account: {
        en: {
          name: 'Doxxing',
          description:
            'This account has been reported to publish private information about someone without their consent. This report is currently under review.',
        },
      },
      content: {
        en: {
          name: 'Doxxing',
          description:
            'This content has been reported to include private information about someone without their consent.',
        },
      },
    },
  },
  porn: {
    id: 'porn',
    preferences: ['ignore', 'warn', 'hide'],
    flags: ['adult'],
    onwarn: 'blur-media',
    groupId: 'sexual',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Pornography',
          description:
            'Images of full-frontal nudity (genitalia) in any sexualized context, or explicit sexual activity (meaning contact with genitalia or breasts) even if partially covered. Includes graphic sexual cartoons (often jokes/memes).',
        },
      },
      account: {
        en: {
          name: 'Adult Content',
          description:
            'This account contains imagery of full-frontal nudity or explicit sexual activity.',
        },
      },
      content: {
        en: {
          name: 'Adult Content',
          description:
            'This content contains imagery of full-frontal nudity or explicit sexual activity.',
        },
      },
    },
  },
  sexual: {
    id: 'sexual',
    preferences: ['ignore', 'warn', 'hide'],
    flags: ['adult'],
    onwarn: 'blur-media',
    groupId: 'sexual',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Sexually Suggestive',
          description:
            'Content that does not meet the level of "pornography", but is still sexual. Some common examples have been selfies and "hornyposting" with underwear on, or partially naked (naked but covered, eg with hands or from side perspective). Sheer/see-through nipples may end up in this category.',
        },
      },
      account: {
        en: {
          name: 'Suggestive Content',
          description:
            'This account contains imagery which is sexually suggestive. Common examples include selfies in underwear or in partial undress.',
        },
      },
      content: {
        en: {
          name: 'Suggestive Content',
          description:
            'This content contains imagery which is sexually suggestive. Common examples include selfies in underwear or in partial undress.',
        },
      },
    },
  },
  nudity: {
    id: 'nudity',
    preferences: ['ignore', 'warn', 'hide'],
    flags: ['adult'],
    onwarn: 'blur-media',
    groupId: 'sexual',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Nudity',
          description:
            'Nudity which is not sexual, or that is primarily "artistic" in nature. For example: breastfeeding; classic art paintings and sculptures; newspaper images with some nudity; fashion modeling. "Erotic photography" is likely to end up in sexual or porn.',
        },
      },
      account: {
        en: {
          name: 'Adult Content',
          description:
            'This account contains imagery which portrays nudity in a non-sexual or artistic setting.',
        },
      },
      content: {
        en: {
          name: 'Adult Content',
          description:
            'This content contains imagery which portrays nudity in a non-sexual or artistic setting.',
        },
      },
    },
  },
  nsfl: {
    id: 'nsfl',
    preferences: ['ignore', 'warn', 'hide'],
    flags: ['adult'],
    onwarn: 'blur-media',
    groupId: 'violence',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'NSFL',
          description:
            '"Not Suitable For Life." This includes graphic images like the infamous "goatse" (don\'t look it up).',
        },
      },
      account: {
        en: {
          name: 'Graphic Imagery (NSFL)',
          description:
            'This account contains graphic images which are often referred to as "Not Suitable For Life."',
        },
      },
      content: {
        en: {
          name: 'Graphic Imagery (NSFL)',
          description:
            'This content contains graphic images which are often referred to as "Not Suitable For Life."',
        },
      },
    },
  },
  corpse: {
    id: 'corpse',
    preferences: ['ignore', 'warn', 'hide'],
    flags: ['adult'],
    onwarn: 'blur-media',
    groupId: 'violence',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Corpse',
          description:
            'Visual image of a dead human body in any context. Includes war images, hanging, funeral caskets. Does not include all figurative cases (cartoons), but can include realistic figurative images or renderings.',
        },
      },
      account: {
        en: {
          name: 'Graphic Imagery (Corpse)',
          description:
            'This account contains images of a dead human body in any context. Includes war images, hanging, funeral caskets.',
        },
      },
      content: {
        en: {
          name: 'Graphic Imagery (Corpse)',
          description:
            'This content contains images of a dead human body in any context. Includes war images, hanging, funeral caskets.',
        },
      },
    },
  },
  gore: {
    id: 'gore',
    preferences: ['ignore', 'warn', 'hide'],
    flags: ['adult'],
    onwarn: 'blur-media',
    groupId: 'violence',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Gore',
          description:
            'Intended for shocking images, typically involving blood or visible wounds.',
        },
      },
      account: {
        en: {
          name: 'Graphic Imagery (Gore)',
          description:
            'This account contains shocking images involving blood or visible wounds.',
        },
      },
      content: {
        en: {
          name: 'Graphic Imagery (Gore)',
          description:
            'This content contains shocking images involving blood or visible wounds.',
        },
      },
    },
  },
  torture: {
    id: 'torture',
    preferences: ['ignore', 'warn', 'hide'],
    flags: ['adult'],
    onwarn: 'blur',
    groupId: 'violence',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Torture',
          description:
            'Depictions of torture of a human or animal (animal cruelty).',
        },
      },
      account: {
        en: {
          name: 'Graphic Imagery (Torture)',
          description:
            'This account contains depictions of torture of a human or animal.',
        },
      },
      content: {
        en: {
          name: 'Graphic Imagery (Torture)',
          description:
            'This content contains depictions of torture of a human or animal.',
        },
      },
    },
  },
  'self-harm': {
    id: 'self-harm',
    preferences: ['ignore', 'warn', 'hide'],
    flags: ['adult'],
    onwarn: 'blur-media',
    groupId: 'violence',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Self-Harm',
          description:
            'A visual depiction (photo or figurative) of cutting, suicide, or similar.',
        },
      },
      account: {
        en: {
          name: 'Graphic Imagery (Self-Harm)',
          description:
            'This account includes depictions of cutting, suicide, or other forms of self-harm.',
        },
      },
      content: {
        en: {
          name: 'Graphic Imagery (Self-Harm)',
          description:
            'This content includes depictions of cutting, suicide, or other forms of self-harm.',
        },
      },
    },
  },
  'intolerant-race': {
    id: 'intolerant-race',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'blur',
    groupId: 'intolerance',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Racial Intolerance',
          description: 'Hateful or intolerant content related to race.',
        },
      },
      account: {
        en: {
          name: 'Intolerance (Racial)',
          description:
            'This account includes hateful or intolerant content related to race.',
        },
      },
      content: {
        en: {
          name: 'Intolerance (Racial)',
          description:
            'This content includes hateful or intolerant views related to race.',
        },
      },
    },
  },
  'intolerant-gender': {
    id: 'intolerant-gender',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'blur',
    groupId: 'intolerance',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Gender Intolerance',
          description:
            'Hateful or intolerant content related to gender or gender identity.',
        },
      },
      account: {
        en: {
          name: 'Intolerance (Gender)',
          description:
            'This account includes hateful or intolerant content related to gender or gender identity.',
        },
      },
      content: {
        en: {
          name: 'Intolerance (Gender)',
          description:
            'This content includes hateful or intolerant views related to gender or gender identity.',
        },
      },
    },
  },
  'intolerant-sexual-orientation': {
    id: 'intolerant-sexual-orientation',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'blur',
    groupId: 'intolerance',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Sexual Orientation Intolerance',
          description:
            'Hateful or intolerant content related to sexual preferences.',
        },
      },
      account: {
        en: {
          name: 'Intolerance (Orientation)',
          description:
            'This account includes hateful or intolerant content related to sexual preferences.',
        },
      },
      content: {
        en: {
          name: 'Intolerance (Orientation)',
          description:
            'This content includes hateful or intolerant views related to sexual preferences.',
        },
      },
    },
  },
  'intolerant-religion': {
    id: 'intolerant-religion',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'blur',
    groupId: 'intolerance',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Religious Intolerance',
          description:
            'Hateful or intolerant content related to religious views or practices.',
        },
      },
      account: {
        en: {
          name: 'Intolerance (Religious)',
          description:
            'This account includes hateful or intolerant content related to religious views or practices.',
        },
      },
      content: {
        en: {
          name: 'Intolerance (Religious)',
          description:
            'This content includes hateful or intolerant views related to religious views or practices.',
        },
      },
    },
  },
  intolerant: {
    id: 'intolerant',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'blur',
    groupId: 'intolerance',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Intolerance',
          description:
            'A catchall for hateful or intolerant content which is not covered elsewhere.',
        },
      },
      account: {
        en: {
          name: 'Intolerance',
          description: 'This account includes hateful or intolerant content.',
        },
      },
      content: {
        en: {
          name: 'Intolerance',
          description: 'This content includes hateful or intolerant views.',
        },
      },
    },
  },
  'icon-intolerant': {
    id: 'icon-intolerant',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'blur-media',
    groupId: 'intolerance',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Intolerant Iconography',
          description:
            'Visual imagery associated with a hate group, such as the KKK or Nazi, in any context (supportive, critical, documentary, etc).',
        },
      },
      account: {
        en: {
          name: 'Intolerant Iconography',
          description:
            'This account includes imagery associated with a hate group such as the KKK or Nazis. This warning may apply to content any context, including critical or documentary purposes.',
        },
      },
      content: {
        en: {
          name: 'Intolerant Iconography',
          description:
            'This content includes imagery associated with a hate group such as the KKK or Nazis. This warning may apply to content any context, including critical or documentary purposes.',
        },
      },
    },
  },
  threat: {
    id: 'threat',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'blur',
    groupId: 'rude',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Threats',
          description:
            'Statements or imagery published with the intent to threaten, intimidate, or harm.',
        },
      },
      account: {
        en: {
          name: 'Threats',
          description:
            'The moderators believe this account has published statements or imagery with the intent to threaten, intimidate, or harm others.',
        },
      },
      content: {
        en: {
          name: 'Threats',
          description:
            'The moderators believe this content was published with the intent to threaten, intimidate, or harm others.',
        },
      },
    },
  },
  spoiler: {
    id: 'spoiler',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'blur',
    groupId: 'curation',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Spoiler',
          description:
            'Discussion about film, TV, etc which gives away plot points.',
        },
      },
      account: {
        en: {
          name: 'Spoiler Warning',
          description:
            'This account contains discussion about film, TV, etc which gives away plot points.',
        },
      },
      content: {
        en: {
          name: 'Spoiler Warning',
          description:
            'This content contains discussion about film, TV, etc which gives away plot points.',
        },
      },
    },
  },
  spam: {
    id: 'spam',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'blur',
    groupId: 'spam',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Spam',
          description:
            'Repeat, low-quality messages which are clearly not designed to add to a conversation or space.',
        },
      },
      account: {
        en: {
          name: 'Spam',
          description:
            'This account publishes repeat, low-quality messages which are clearly not designed to add to a conversation or space.',
        },
      },
      content: {
        en: {
          name: 'Spam',
          description:
            'This content is a part of repeat, low-quality messages which are clearly not designed to add to a conversation or space.',
        },
      },
    },
  },
  'account-security': {
    id: 'account-security',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'blur',
    groupId: 'misinfo',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Security Concerns',
          description:
            'Content designed to hijack user accounts such as a phishing attack.',
        },
      },
      account: {
        en: {
          name: 'Security Warning',
          description:
            'This account has published content designed to hijack user accounts such as a phishing attack.',
        },
      },
      content: {
        en: {
          name: 'Security Warning',
          description:
            'This content is designed to hijack user accounts such as a phishing attack.',
        },
      },
    },
  },
  'net-abuse': {
    id: 'net-abuse',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'blur',
    groupId: 'misinfo',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Network Attacks',
          description:
            'Content designed to attack network systems such as denial-of-service attacks.',
        },
      },
      account: {
        en: {
          name: 'Network Attack Warning',
          description:
            'This account has published content designed to attack network systems such as denial-of-service attacks.',
        },
      },
      content: {
        en: {
          name: 'Network Attack Warning',
          description:
            'This content is designed to attack network systems such as denial-of-service attacks.',
        },
      },
    },
  },
  impersonation: {
    id: 'impersonation',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'alert',
    groupId: 'misinfo',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Impersonation',
          description: 'Accounts which falsely assert some identity.',
        },
      },
      account: {
        en: {
          name: 'Impersonation Warning',
          description:
            'The moderators believe this account is lying about their identity.',
        },
      },
      content: {
        en: {
          name: 'Impersonation Warning',
          description:
            'The moderators believe this account is lying about their identity.',
        },
      },
    },
  },
  misleading: {
    id: 'misleading',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'alert',
    groupId: 'misinfo',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Misleading',
          description: 'Accounts which share misleading information.',
        },
      },
      account: {
        en: {
          name: 'Misleading',
          description:
            'The moderators believe this account is spreading misleading information.',
        },
      },
      content: {
        en: {
          name: 'Misleading',
          description:
            'The moderators believe this account is spreading misleading information.',
        },
      },
    },
  },
  scam: {
    id: 'scam',
    preferences: ['ignore', 'warn', 'hide'],
    flags: [],
    onwarn: 'alert',
    groupId: 'misinfo',
    configurable: true,
    strings: {
      settings: {
        en: {
          name: 'Scam',
          description: 'Fraudulent content.',
        },
      },
      account: {
        en: {
          name: 'Scam Warning',
          description:
            'The moderators believe this account publishes fraudulent content.',
        },
      },
      content: {
        en: {
          name: 'Scam Warning',
          description: 'The moderators believe this is fraudulent content.',
        },
      },
    },
  },
}
