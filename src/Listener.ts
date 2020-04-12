import { EventEmitter } from './EventEmitter';

export class Listener {
	constructor(public owner: EventEmitter, public event: Function, public listener: Function) {}

	unbind() {
		this.owner.removeListener(this);
	}
}
