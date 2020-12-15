import type { EventEmitter } from './EventEmitter';

export class Listener {
	constructor(
		public readonly owner: EventEmitter,
		public readonly event: Function,
		public readonly listener: Function
	) {}

	unbind(): void {
		this.owner.removeListener(this);
	}
}
