
<p align="middle"><img src="https://daybrush.com/scenejs/images/clapperboard.png" width="250"/></p>
<h2 align="middle">Scene.js Timeline</h2>
<p align="middle"><a href="https://badge.fury.io/js/%40scenejs%2Ftimeline" target="_blank"><img src="https://badge.fury.io/js/%40scenejs%2Ftimeline.svg" alt="npm version" height="18"/></a> <img src="https://img.shields.io/badge/language-typescript-blue.svg"/> <a href="https://github.com/daybrush/scenejs-timeline/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/daybrush/scenejs-timeline.svg"/></a></p>


<p align="middle">A library that represents the timeline of <a href="https://github.com/daybrush/scenejs"><strong>Scene.js</strong></a><br/>You can control time, properties, and items.</p>

<p align="middle"><a href="https://github.com/daybrush/scenejs"><strong>Scene.js</strong></a> &nbsp;/&nbsp; <a href="https://daybrush.com/scenejs/features.html#timeline"><strong>Example</strong></a></p>


<p align="middle"><img src="https://raw.githubusercontent.com/daybrush/scenejs-timeline/master/demo/images/timeline.png"/></p>




### Related Projects
* [**react-scenejs-timeline**](https://github.com/daybrush/scenejs-timeline/tree/master/packages/react-scenejs-timeline): A React Component that control scene.js timeline.
* [**preact-timeline**](https://github.com/daybrush/scenejs-timeline/tree/master/packages/preact-timeline): A Preact Component that control scene.js timeline.

### Installation
```sh
$ npm i @scenejs/timeline
```

```html
<script src="https://daybrush.com/scenejs-timeline/release/latest/dist/timeline.pkgd.min.js"></script>
```


### How to use
```ts
import Scene from "scenejs";
import Timeline, { SelectEvent } from "@scenejs/timeline";

const scene = new Scene({
    ...
});

const timeline = new Timeline(scene, document.body, {
    keyboard: true,
});

timeline.on("select", (e: SelectEvent) => {
    console.log(e.selectedItem);
});
```





```
MIT License

Copyright (c) 2019 Daybrush

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

