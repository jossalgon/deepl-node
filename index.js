const alternative = require('deepl-translator');
const axios = require('axios');

const HOST = 'https://api.deepl.com';
const VERSION = 'v1';

module.exports = class Deepl {
  /**
  * DeepL constructor, if optional values are filled they are taken by default.
  * @param {String} auth_key REQUIRED The authentication key as provided to you.
  * @param {Boolean} use_alternative OPTIONAL Try to use first an alternative.
  * @param {String} tag_handling OPTIONAL Language of the text to be translated.
  * @param {String} split_sentences OPTIONAL The language into which you want to translate.
  * @param {String} preserve_formatting OPTIONAL Sets which kind of tags should be handled.
  * @param {String} target_lang OPTIONAL Sets whether the translation engine should first split the input into sentences.
  * @param {String} source_lang OPTIONAL Sets whether the translation engine should preserve some aspects of the formatting, even if it would usually correct some aspects.
  */
  constructor(auth_key, use_alternative, tag_handling, split_sentences, preserve_formatting, target_lang, source_lang) {
    this.auth_key = auth_key;
    this.use_alternative = use_alternative || false;
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
  _request(text, target_lang=this.target_lang, source_lang=this.source_lang, tag_handling=this.tag_handling, split_sentences=this.split_sentences, preserve_formatting=this.preserve_formatting) {
    let url = `${HOST}/${VERSION}/translate?auth_key=${this.auth_key}&text=${text}&target_lang=${target_lang}&source_lang=${source_lang}&tag_handling=${tag_handling}&split_sentences=${split_sentences}&preserve_formatting=${preserve_formatting}`.replace(/&\w+=undefined/g, '');
    return axios.get(encodeURI(url));
  }

  _sendRequest(params, cb) {
    this._request(...params).then((res) => {
      if (res.data && res.data.translations && res.data.translations.length > 0 && res.data.translations[0].text) {
        cb(undefined, res.data.translations[0].text);
      } else {
        cb(new Error(res.status));
      }
    })
    .catch((err) => {
      cb(err);
    });
  }

  /**
  * Translate a text with DeepL.
  * @param {String} text REQUIRED Text to be translated.
  * @param {String} target_lang REQUIRED Sets whether the translation engine should first split the input into sentences.
  * @param {String} source_lang OPTIONAL Sets whether the translation engine should preserve some aspects of the formatting, even if it would usually correct some aspects.
  * @param {String} tag_handling OPTIONAL Language of the text to be translated.
  * @param {String} split_sentences OPTIONAL The language into which you want to translate.
  * @param {String} preserve_formatting OPTIONAL Sets which kind of tags should be handled.
  * @param {Callback} cb REQUIRED Callback must be the last parameter.
  */
  translate(...params) {
    let cb = params.pop();
    if (this.use_alternative) {
      alternative.translate(params[0], params[1].toUpperCase(), params[2].toUpperCase()).then((res) => {
        cb(undefined, res.translation);
      })
      .catch(err => this._sendRequest(params, cb));
    } else {
      this._sendRequest(params, cb);
    }
  }

  /**
  * DeepL API usage.
  * @return {Promise} A promise with the deepL usage response.
  */
  _usage() {
    return axios.get(`${HOST}/${VERSION}/usage?auth_key=${this.auth_key}`);
  }

}
