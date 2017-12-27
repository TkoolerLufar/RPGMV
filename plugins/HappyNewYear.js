/*:
 * @plugindesc
 * A useful plugin to celebrate a happy new year.
 *
 * @author
 * Lufar (http://rufer.my.land.to/)
 *
 * @param frameRate
 * @desc The frame rate of this game. It's 60 in usual.
 * @default 60
 *
 * @help
 * When you would like to get the remain time of this year,
 * use "Lufar.HappyNewYear.getRemainFramesTillNewYear()" function.
 * Set this to a variable, it is set to a
 * remain frame count of this year.
 */
/*:ja
 * @plugindesc
 * 年越しカウントダウンに便利なプラグインです。
 *
 * @author
 * ルファー (http://rufer.my.land.to/)
 *
 * @param frameRate
 * @desc このゲームのフレームレート。普通は 60 です。
 * @default 60
 *
 * @help
 * 年越しまでの残り時間を取得したいときに
 * "Lufar.HappyNewYear.getRemainFramesTillNewYear()" 関数を使います。
 * 変数の値としてセットすると、年越しまでの残りフレーム数が取得できます。
 */

/*
Copyright 2017 TkoolerLufar

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
(function() {
	// namespace
	Lufar = Lufar || {};
	Lufar.HappyNewYear = {
	// 年越しまでのフレーム数を取得する関数
		"getRemainFramesTillNewYear": function() {
			var now = new Date();
			var nextYear = new Date(now.getFullYear() + 1, 0, 1);

			var diffMilliSecs = nextYear.getTime() - now.getTime();

			// milliseconds -> frames (= 1/60 secs)
			return Math.floor(diffMilliSecs *
				parseInt(PluginManager.parameters('HappyNewYear').frameRate) / 1000 + 0.5);
		}
	};
})();
