export interface Tool {
  name: string;
  /**
   * The vendor's own mark, drawn from their published assets — never an
   * approximation, which would be both wrong and still theirs. Each is a
   * third-party trademark shown to say what the pipeline runs on; nothing here
   * may imply that any of them endorses or partners with us.
   *
   * Shown in the vendor's colour where they have one. HeyGen, Claude and Meta
   * do; OpenAI and ElevenLabs publish a monochrome mark, so those two carry
   * white — the file itself is painted, rather than the row recolouring marks
   * that are not ours to restyle.
   */
  logoUrl: string;
}

/** The stack behind the pipeline, in the order the owner listed it. */
export const TOOLS: readonly Tool[] = [
  { name: 'HeyGen', logoUrl: '/logos/heygen.avif' },
  { name: 'ChatGPT', logoUrl: '/logos/openai.svg' },
  { name: 'Claude', logoUrl: '/logos/claude.svg' },
  { name: 'Meta', logoUrl: '/logos/meta.svg' },
  { name: 'ElevenLabs', logoUrl: '/logos/elevenlabs.svg' },
];
