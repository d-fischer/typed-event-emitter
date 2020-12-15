import type { EventEmitter } from './EventEmitter';

export class Listener {
	constructor(
		public readonly owner: EventEmitter,
		public readonly event: Function,
		public readonly listener: Function,
		private readonly _internal = false
	) {}

	unbind(): void {
		if (this._internal) {
			this.owner.removeInternalListener(this);
		} else {
			this.owner.removeListener(this);
		}
	}
}
