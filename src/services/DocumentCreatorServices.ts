// DependenceService.ts
import axios from 'axios';

const DependenceService = {
    getHeaderContentPage() {
        return `
            <body style="word-wrap: break-word; overflow-wrap: break-word;">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    text-decoration: none;
                    font-family: Poppins, sans-serif;
                }
                ul, ol {
                    margin: 0 1rem;
                    padding: 0 1rem;
                }
                ul > li {
                    list-style: initial;
                }
                ol > li {
                    list-style: decimal;
                }
                h1 {
                    font-size: xx-large;
                    line-height: 1.1;
                }
                h2 {
                    font-size: x-large;
                    line-height: 1.1;
                }
                h3 {
                    font-size: large;
                    line-height: 1.1;
                }
                h4 {
                    font-size: medium;
                    line-height: 1.1;
                }
                h5 {
                    font-size: small;
                    line-height: 1.1;
                }
                h6 {
                    font-size: x-small;
                    line-height: 1.1;
                }
                code {
                    background-color: rgba(#616161, 0.1);
                    color: #616161;
                }
                pre {
                    background: #0d0d0d;
                    color: #fff;
                    font-family: "JetBrainsMono", monospace;
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                }
                pre code {
                    color: #fff;
                    padding: 0;
                    background: none;
                    font-size: 0.8rem;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
                blockquote {
                    padding-left: 1rem;
                    border-left: 2px solid gray;
                }
                hr {
                    border: none;
                    border-top: 2px solid gray;
                    margin: 2rem 0;
                }
                s {
                    text-decoration: line-through;
                }
                u {
                    text-decoration: underline;
                }
            </style>
            <p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM8AAAAhCAYAAAB+z/+tAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxIAAAsSAdLdfvwAABQSSURBVHhe7Z0JnI5V+8ftjH0b+66QLVtoskWJKFlK8ZKy/ilF1pASEUklpRclW4st/xTJvoVEiQrRWKqJZJ3GmKH3fJ//ffzPnLme+7mfeZ55p0+fuT6fn7mX6yz3fZ9zbec6j4x//fVXhnT6Z9Avv/xSYs2aNS2XLl3acefOnQ1Onz4dmSlTpmtly5Y91rRp003333//4vr16+8qXLjw706RvyVduXIlW3x8fPaMGTMmGZzXrl3LlCNHjsvZsmW74lxKU0oyeRYtWtTlhx9+qJI9e/b4YsWKxRQqVOhMvnz5zmfJkiXx6tWrmXmouLi4iNjY2FyXLl3KzQNmzpz5aq5cuWJz5859Cf5SpUqdLF++/E9cd6pNp1Qkvsfy5cvbr169utWOHTsanjhxojTfRX3XjA6Lj5hEfKeKFSseiYqK2t66detVbdu2Xenc/lvRiy++OHzlypVt7TGUmJiYpXHjxlsmTpw40rmUtsTkARMmTHiaUxvqARLVTI9XEyhBSYJrEo8GPJGRkaduuumm7x588MH3Fi5c2OWPP/4ooNtIR3jxzjvv9KhateoB6Vt4gRqIm9euXdtCqjst0a1bt3lSf8Fdd921WiqTFvD989tvvxVRWgNVnqyzoaJ48eK/jBgxYmJMTExRu/F0pAynTp2KfOCBBz6Q3ndK8Oyzz46V2kkr9O3bd6bUT9CxY8clUpm0gO+fs2fP5q9Spcr3Umc10Dpolpw5c8bmz5//bIECBf7grzLXLioz77IyC1CxYllwww03HN60aVMTuwPpCA7R0dFla9WqtVd6x6Hg8ccff01qLy3Qp0+ft6Q+gg4dOiyVyqQFrh8cPHiwUoMGDXaYHa1Zs+Y3M2bM6P/+++93Vo7onV999VWdY8eOlfn9998LaSgntThlN27c2HT+/Pn/Gjdu3BgesEyZMsfMuoBy9uIWL17cyexAOrzj3Llz+erUqfOV/V7Dhb+LBurXr9+bUv9Ap06dFktl0gJJTpST1sbs6KhRo8ab94MBEnLmzJl9bY2WN2/e899//30VqUw63IEfab7LcAPfdvPmzY2ltiVg7mNNLFmypOOyZcva79ixowET3Oa7fPly9vPnz+e9ePFibhNc4x48V65cycp5YmJi5p49e86W+gfatWv3ETyxsbE5dR3x8fHZ7DYlwLtnz57ajHOE+IoVK+794osvGp4+fbqwxB8ISU7mzJnzqNnRRYsWPWTeTwl4wN69e//brBe79erVq5kk/nTIQPub79AfMI9534p6MzgY1FOmTBnSvn37ZZjYUhkTUVFR265du+aLwkpg4NKX1q1bf5ovX75zBJR02axZs14pWrRozCOPPPL2l19+WU+XYTJg4uP/muDak08+OQ2eSZMmDae+UqVKnciVK9cls08mIiIi/oSnRIkSP1MHZcaOHfusbssGk3nBggVdmXRFihT5DQFh1kef6UezZs02TJ8+/bETJ06UkuqRkOSEh9aV4t+EU0P06NHjHV03D7B9+/ZbJb50JAcC6Oabb/5avz8JDALMLjcpunPnzvpNmjTZJJU38emnn7aWyu/bt69G8+bN10llbPCNx48fP4pynTt3fl/iAd27d38XnmHDhr0o3feCgQMHvmr2UwPtEqx/WLZs2ehXX311oFSfjesHqEFCzLqS0qVLH4+Li8thMocC/COkkq7/sccemy7xaXzzzTc1kQSjR49+HrNA4gkWv/76a7HBgwdPrVat2v5p06Y9KfH8N/D555/f8e2331aX7klgEOj3JoGJs3z58vuksjYIDjVs2PALqR4NKRy8devW28zv5xXPPffcM6ZQtvHoo4/OoX5cBOm+Fzz11FMv2f0NZTKChx56aFGg8X/94NChQzeaKrhly5afmYzhgPkSK1as+KNkqyI5cRgZEJoXIKG82rYSCHbceOONh8w6P/jggwck3tTEJ598cjdtE2qW7ksI5OsEKwh+/PHHikjXN95443/efPPNfiao67333nvQNN2OHDlSARNJatsLiMz6WyNkTNBGOCfPoEGDXpb4gsXdd9/9Cb6YWbeJ6wfYx2bBoUOHTjYZwwFzIZbI2+HDh28w7xOxq1y58g9mP0z06tVrlsnvFdu2bYuS1rGwm4Ndf+Jlrlq1qlVKzE78hXr16n1J2/5MDRtoCmx1u+8amCWhCBUvaNGixVqp7WAQaPKwFijd9wLtN4F33323u8STUjz99NMTdN02MikGH3399de1nEMfValShUEcVvrzzz9zOoe+PCXSLZxTIn1tSRc5ePBgZedS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" /></p>
            </body>
            `
    },
    getBodyContentPage() {
        return `
            <body style="word-wrap: break-word; overflow-wrap: break-word;">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    text-decoration: none;
                    font-family: Poppins, sans-serif;
                }
                ul, ol {
                    margin: 0 1rem;
                    padding: 0 1rem;
                }
                ul > li {
                    list-style: initial;
                }
                ol > li {
                    list-style: decimal;
                }
                h1 {
                    font-size: xx-large;
                    line-height: 1.1;
                }
                h2 {
                    font-size: x-large;
                    line-height: 1.1;
                }
                h3 {
                    font-size: large;
                    line-height: 1.1;
                }
                h4 {
                    font-size: medium;
                    line-height: 1.1;
                }
                h5 {
                    font-size: small;
                    line-height: 1.1;
                }
                h6 {
                    font-size: x-small;
                    line-height: 1.1;
                }
                code {
                    background-color: rgba(#616161, 0.1);
                    color: #616161;
                }
                pre {
                    background: #0d0d0d;
                    color: #fff;
                    font-family: "JetBrainsMono", monospace;
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                }
                pre code {
                    color: #fff;
                    padding: 0;
                    background: none;
                    font-size: 0.8rem;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
                blockquote {
                    padding-left: 1rem;
                    border-left: 2px solid gray;
                }
                hr {
                    border: none;
                    border-top: 2px solid gray;
                    margin: 2rem 0;
                }
                s {
                    text-decoration: line-through;
                }
                u {
                    text-decoration: underline;
                }
            </style>
            <p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM8AAAAhCAYAAAB+z/+tAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxIAAAsSAdLdfvwAABQSSURBVHhe7Z0JnI5V+8ftjH0b+66QLVtoskWJKFlK8ZKy/ilF1pASEUklpRclW4st/xTJvoVEiQrRWKqJZJ3GmKH3fJ//ffzPnLme+7mfeZ55p0+fuT6fn7mX6yz3fZ9zbec6j4x//fVXhnT6Z9Avv/xSYs2aNS2XLl3acefOnQ1Onz4dmSlTpmtly5Y91rRp003333//4vr16+8qXLjw706RvyVduXIlW3x8fPaMGTMmGZzXrl3LlCNHjsvZsmW74lxKU0oyeRYtWtTlhx9+qJI9e/b4YsWKxRQqVOhMvnz5zmfJkiXx6tWrmXmouLi4iNjY2FyXLl3KzQNmzpz5aq5cuWJz5859Cf5SpUqdLF++/E9cd6pNp1Qkvsfy5cvbr169utWOHTsanjhxojTfRX3XjA6Lj5hEfKeKFSseiYqK2t66detVbdu2Xenc/lvRiy++OHzlypVt7TGUmJiYpXHjxlsmTpw40rmUtsTkARMmTHiaUxvqARLVTI9XEyhBSYJrEo8GPJGRkaduuumm7x588MH3Fi5c2OWPP/4ooNtIR3jxzjvv9KhateoB6Vt4gRqIm9euXdtCqjst0a1bt3lSf8Fdd921WiqTFvD989tvvxVRWgNVnqyzoaJ48eK/jBgxYmJMTExRu/F0pAynTp2KfOCBBz6Q3ndK8Oyzz46V2kkr9O3bd6bUT9CxY8clUpm0gO+fs2fP5q9Spcr3Umc10Dpolpw5c8bmz5//bIECBf7grzLXLioz77IyC1CxYllwww03HN60aVMTuwPpCA7R0dFla9WqtVd6x6Hg8ccff01qLy3Qp0+ft6Q+gg4dOiyVyqQFrh8cPHiwUoMGDXaYHa1Zs+Y3M2bM6P/+++93Vo7onV999VWdY8eOlfn9998LaSgntThlN27c2HT+/Pn/Gjdu3BgesEyZMsfMuoBy9uIWL17cyexAOrzj3Llz+erUqfOV/V7Dhb+LBurXr9+bUv9Ap06dFktl0gJJTpST1sbs6KhRo8ab94MBEnLmzJl9bY2WN2/e899//30VqUw63IEfab7LcAPfdvPmzY2ltiVg7mNNLFmypOOyZcva79ixowET3Oa7fPly9vPnz+e9ePFibhNc4x48V65cycp5YmJi5p49e86W+gfatWv3ETyxsbE5dR3x8fHZ7DYlwLtnz57ajHOE+IoVK+794osvGp4+fbqwxB8ISU7mzJnzqNnRRYsWPWTeTwl4wN69e//brBe79erVq5kk/nTIQPub79AfMI9534p6MzgY1FOmTBnSvn37ZZjYUhkTUVFR265du+aLwkpg4NKX1q1bf5ovX75zBJR02axZs14pWrRozCOPPPL2l19+WU+XYTJg4uP/muDak08+OQ2eSZMmDae+UqVKnciVK9cls08mIiIi/oSnRIkSP1MHZcaOHfusbssGk3nBggVdmXRFihT5DQFh1kef6UezZs02TJ8+/bETJ06UkuqRkOSEh9aV4t+EU0P06NHjHV03D7B9+/ZbJb50JAcC6Oabb/5avz8JDALMLjcpunPnzvpNmjTZJJU38emnn7aWyu/bt69G8+bN10llbPCNx48fP4pynTt3fl/iAd27d38XnmHDhr0o3feCgQMHvmr2UwPtEqx/WLZs2ehXX311oFSfjesHqEFCzLqS0qVLH4+Li8thMocC/COkkq7/sccemy7xaXzzzTc1kQSjR49+HrNA4gkWv/76a7HBgwdPrVat2v5p06Y9KfH8N/D555/f8e2331aX7klgEOj3JoGJs3z58vuksjYIDjVs2PALqR4NKRy8devW28zv5xXPPffcM6ZQtvHoo4/OoX5cBOm+Fzz11FMv2f0NZTKChx56aFGg8X/94NChQzeaKrhly5afmYzhgPkSK1as+KNkqyI5cRgZEJoXIKG82rYSCHbceOONh8w6P/jggwck3tTEJ598cjdtE2qW7ksI5OsEKwh+/PHHikjXN95443/efPPNfiao67333nvQNN2OHDlSARNJatsLiMz6WyNkTNBGOCfPoEGDXpb4gsXdd9/9Cb6YWbeJ6wfYx2bBoUOHTjYZwwFzIZbI2+HDh28w7xOxq1y58g9mP0z06tVrlsnvFdu2bYuS1rGwm4Ndf+Jlrlq1qlVKzE78hXr16n1J2/5MDRtoCmx1u+8amCWhCBUvaNGixVqp7WAQaPKwFijd9wLtN4F33323u8STUjz99NMTdN02MikGH3399de1nEMfValShUEcVvrzzz9zOoe+PCXSLZxTIn1tSRc5ePBgZedS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" /></p>
            </body>
            `
    },
    getFooterContentPage() {
        return `
            <body style="word-wrap: break-word; overflow-wrap: break-word;"><style>

    * {
        margin: 0;
        padding: 0;
        list-style: none;
        text-decoration: none;
        font-family: Poppins, sans-serif;
    }

    ul, ol {
        margin: 0 1rem;
        padding: 0 1rem;
    }

    ul > li {
        list-style: initial;
    }

    ol > li {
        list-style: decimal;
    }

    h1 {
        font-size: xx-large;
        line-height: 1.1;
    }

    h2 {
        font-size: x-large;
        line-height: 1.1;
    }

    h3 {
        font-size: large;
        line-height: 1.1;
    }

    h4 {
        font-size: medium;
        line-height: 1.1;
    }

    h5 {
        font-size: small;
        line-height: 1.1;
    }

    h6 {
        font-size: x-small;
        line-height: 1.1;
    }

    code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
    }

    pre {
        background: #0d0d0d;
        color: #fff;
        font-family: "JetBrainsMono", monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
    }

    pre code {
        color: #fff;
        padding: 0;
        background: none;
        font-size: 0.8rem;
    }

    img {
        max-width: 100%;
        height: auto;
    }

    blockquote {
        padding-left: 1rem;
        border-left: 2px solid gray;
    }

    hr {
        border: none;
        border-top: 2px solid gray;
        margin: 2rem 0;
    }

    s {
        text-decoration: line-through;
    }

    u {
        text-decoration: underline;
    }   
    </style><p style="text-align: center"><span style="color: #636363">SUNTIC S.A.S</span></p></body>
            `
    },
};

export default DependenceService;
