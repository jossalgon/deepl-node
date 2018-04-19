const axios = require('axios');

const HOST = 'https://api.deepl.com';
const VERSION = 'v1';

class Deepl {
  /**
  * DeepL constructor, if optional values are filled they are taken by default.
  * @param {String} auth_key REQUIRED The authentication key as provided to you.
  * @param {String} tag_handling OPTIONAL Language of the text to be translated.
  * @param {String} split_sentences OPTIONAL The language into which you want to translate.
  * @param {String} preserve_formatting OPTIONAL Sets which kind of tags should be handled.
  * @param {String} target_lang OPTIONAL Sets whether the translation engine should first split the input into sentences.
  * @param {String} source_lang OPTIONAL Sets whether the translation engine should preserve some aspects of the formatting, even if it would usually correct some aspects.
  */
  constructor(auth_key, tag_handling, split_sentences, preserve_formatting, target_lang, source_lang) {
    this.auth_key = auth_key;
    this.tag_handling = tag_handling;
    this.split_sentences = split_sentences;
    this.preserve_formatting = preserve_formatting;
    this.target_lang = target_lang;
    this.source_lang = source_lang;
  }


  /**
  * Translate a text with DeepL.
  * @param {String} text REQUIRED Text to be translated.
  * @param {String} target_lang REQUIRED Sets whether the translation engine should first split the input into sentences.
  * @param {String} source_lang OPTIONAL Sets whether the translation engine should preserve some aspects of the formatting, even if it would usually correct some aspects.
  * @param {String} tag_handling OPTIONAL Language of the text to be translated.
  * @param {String} split_sentences OPTIONAL The language into which you want to translate.
  * @param {String} preserve_formatting OPTIONAL Sets which kind of tags should be handled.
  * @return {Promise} A promise with the deepL response.
  */
  translate(text, target_lang=this.target_lang, source_lang=this.source_lang, tag_handling=this.tag_handling, split_sentences=this.split_sentences, preserve_formatting=this.preserve_formatting) {
    return axios.get(`${HOST}/{${VERSION}}/translate?auth_key=${this.auth_key}&text=${text}&target_lang=${target_lang}&source_lang=${source_lang}&tag_handling=${tag_handling}&split_sentences=${split_sentences}&preserve_formatting=${preserve_formatting}`);
  }

  /**
  * DeepL API usage.
  * @return {Promise} A promise with the deepL usage response.
  */
  usage() {
    return axios.get(`${HOST}/{${VERSION}}/usage?auth_key=${this.auth_key}`);
  }

}
