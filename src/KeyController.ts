import Scene from "scenejs";
import Component from "@egjs/component";
import { IObject } from "@daybrush/utils";

class KeyController extends Component {
    private hasKeyDownEvent = false;
    private hasKeyUpEvent = false;
    private keydownCombis: IObject<string> = {};
    private keyupCombis: IObject<string> = {};
    constructor(private container: HTMLElement) {
        super();
    }
    public keydown(comb: string, callback: (e: KeyboardEvent) => void) {
        if (!this.hasKeyDownEvent) {
            this.hasKeyDownEvent = true;
            this.container.addEventListener("keydown", this.keydownEvent);
        }
        this.on(`keydown.${comb}`, callback);
    }
    public keyup(comb: string, callback: (e: KeyboardEvent) => void) {
        if (!this.hasKeyUpEvent) {
            this.hasKeyDownEvent = true;
            this.container.addEventListener("keyup", this.keyupEvent);
        }
        this.on(`keyup.${comb}`, callback);
    }
    private keydownEvent = (e: KeyboardEvent) => {
        const keyCode = e.keyCode;
    }
    private keyupEvent = (e: KeyboardEvent) => {
        const keyCode = e.keyCode;
    }
}
