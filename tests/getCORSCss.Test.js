/* eslint-disable */
import {getCrossDomainCSSRules} from '../source/getCORSCss.js';
describe("getCrossDomainCSSRules", function() {
    it('should getCrossDomainCSSRules set new CORS link correctly', async function () {
        // document.styleSheets[2] href based on http://localhost:9876/base/tests/corscss.css?
        spyOnProperty(document.styleSheets[2], 'cssRules').and.callFake(() => {
            throw new DOMException("Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules", 'SecurityError');
        });
        expect(() => {document.styleSheets[2].cssRules;}).toThrow(new DOMException("Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules", 'SecurityError'));
        const styleSheetsCount = document.styleSheets.length;
        await getCrossDomainCSSRules(document);
        expect(document.styleSheets[2].ownerNode.crossOrigin).toBe('anonymous'); // should set crossOrigin attr successfully.
        expect(document.styleSheets[0].ownerNode.crossOrigin).toBeNull(); //should not change if no exception threw.
        expect(document.styleSheets.length).toBe(styleSheetsCount); // the styleSheets length should be same after getCrossDomainCSSRules invoked.
    });
});
