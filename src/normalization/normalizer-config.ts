import { LatinReplacements } from './latin-replacements';
import { StringUtilities } from '../commons/string-utilities';

/**
 * Holds configuration values for the default normalizer.
 */
export class NormalizerConfig {
  /**
   * Creates a new instance of the NormalizerConfig class.
   * @param paddingLeft The string that is appended to the left of the input string.
   * @param paddingRight The string that is appended to the right of the input string.
   * @param paddingMiddle The string that is inserted for spaces in the input string.
   * @param replacements A list of replacement maps. Each map maps from the variation character to the base
   * character(s).
   * @param treatCharacterAsSpace A function that determines whether a character is treated as a space.
   * @param allowCharacter A function that determines whether a character is allowed. Padding characters and surrogate
   * characters are disallowed by default.
   */
  public constructor(
    public paddingLeft: string,
    public paddingRight: string,
    public paddingMiddle: string,
    public replacements: Map<string, string[]>[],
    public treatCharacterAsSpace: (c: string) => boolean,
    public allowCharacter: (c: string) => boolean
  ) {}

  /**
   * Creates an opinionated default normalizer config. Applies latin replacements and filters out non-alphanumeric
   * characters. Strings are padded with '$$' on the left, '!' on the right, and '!$$' in the middle. The config is
   * closely related to the default NgramComputerConfig.
   * The full normalization pipeline is built in the class DefaultNormalizer and includes a lowercasing and an NFKD
   * normalization step.
   * @returns The default normalizer config.
   */
  public static createDefaultConfig(): NormalizerConfig {
    const spaceEquivalentCharacters = new Set(['_', '-', '–', '/', ',', '\t']);

    const allowCharacter: (c: string) => boolean = (c) => {
      return StringUtilities.isAlphanumeric(c);
    };

    return new NormalizerConfig(
      '$$',
      '!',
      '!$$',
      [LatinReplacements.Value],
      (c) => spaceEquivalentCharacters.has(c),
      allowCharacter
    );
  }
}
