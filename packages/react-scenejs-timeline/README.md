


<div align="center">
<img src="https://daybrush.com/scenejs/images/clapperboard.png" width="250"/></p>

## Scene.js React Timeline

[![npm version](https://badge.fury.io/js/react-scenejs-timeline.svg)](https://badge.fury.io/js/react-scenejs-timeline)
[![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-next.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)


A library that represents the timeline of [**Scene.js**](https://github.com/daybrush/scenejs). <br/>You can control time, properties, and items.

[**Scene.js**](https://github.com/daybrush/scenejs) &nbsp;/&nbsp;  [**Scene.js Timeline**](https://github.com/daybrush/scenejs-timeline) &nbsp;/&nbsp; [**Example**](http://daybrush.com/scenejs/features.html#timeline)

<br/>

![](https://daybrush.com/scenejs-timeline/images/timeline.png)
</div>

### Installation
```sh
$ npm i react-scenejs-timeline
```


### How to use
```tsx
import Timeline from "react-scenejs-timeline";

render() {
    return (
        <Timeline
            scene={scene}
            keyboard={true}
            onSelect={(e: SelectEvent) => {
                console.log(e.selectedItem);
            }}
        />
    );
}
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
