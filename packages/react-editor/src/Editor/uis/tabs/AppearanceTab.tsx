
import * as React from "react";
import { prefix } from "../../utils/utils";
import styled from "react-css-styled";
import Anchor from "./inputs/Anchor";
import { Text } from "./inputs/Text";

const AppearanceTabElement = styled("div", `
{
    color: #fff;
    font-size: 12px;
}
.scena-tab-line {
    display: flex;
    align-content: center;
    align-items: stretch;
}
.scena-tab-grid {
    width: 90px;
    flex: 1;
}
.scena-tab-input-grid {
    display: flex;
    height: 30px;
}
.scena-tab-label {
    line-height: 30px;
    padding: 0px 8px;
}
.scena-tab-anchor {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
}
`);



export default function AppearanceTab() {
    return <AppearanceTabElement>
        <div className={prefix("tab-line")}>
            <div className={prefix("tab-grid", "tab-anchor")}>
                <Anchor />
            </div>
            <div className={prefix("tab-grid")}>
                <div className={prefix("tab-grid", "tab-input-grid")}>
                    <div className={prefix("tab-label")}>X</div>
                    <div className={prefix("tab-input")}>
                        <Text defaultValue={"10"} />
                    </div>
                </div>
                <div className={prefix("tab-grid", "tab-input-grid")}>
                    <div className={prefix("tab-label")}>Y</div>
                    <div className={prefix("tab-input")}>
                        <Text defaultValue={"10"} />
                    </div>
                </div>
            </div>
            <div className={prefix("tab-grid")}>
                <div className={prefix("tab-grid", "tab-input-grid")}>
                    <div className={prefix("tab-label")}>W</div>
                    <div className={prefix("tab-input")}>
                        <Text defaultValue={"10"} />
                    </div>
                </div>
                <div className={prefix("tab-grid", "tab-input-grid")}>
                    <div className={prefix("tab-label")}>H</div>
                    <div className={prefix("tab-input")}>
                        <Text defaultValue={"10"} />
                    </div>
                </div>
            </div>
        </div>
        <div className={prefix("tab-line")}>
            <div className={prefix("tab-grid", "tab-input-grid")}>
                <div className={prefix("tab-label")}>R</div>
                <div className={prefix("tab-input")}>
                    <Text defaultValue={"10"} />
                </div>
            </div>
            <div className={prefix("tab-grid", "tab-input-grid")}>
                <div className={prefix("tab-label")}>C</div>
                <div className={prefix("tab-input")}>
                    <Text defaultValue={"10"} />
                </div>
            </div>
        </div>
    </AppearanceTabElement>;
}
