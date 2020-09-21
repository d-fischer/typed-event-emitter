import { Listener } from './Listener';

export type EventHandler<Args extends any[]> = (...args: Args) => void;
export type EventBinder<Args extends any[]> = (event: EventHandler<Args>) => Listener;

export class EventEmitter {
	private _eventListeners: Map<Function, Function[]>;

	constructor() {
		this._eventListeners = new Map();
	}

	on<Args extends any[]>(event: EventBinder<Args>, listener: EventHandler<Args>) {
		if (this._eventListeners.has(event)) {
			this._eventListeners.get(event)!.push(listener);
		} else {
			this._eventListeners.set(event, [listener]);
		}

		return new Listener(this, event, listener);
	}

	addListener<Args extends any[]>(event: EventBinder<Args>, listener: EventHandler<Args>) {
		return this.on(event, listener);
	}

	removeListener(): void;
	removeListener(id: Listener): void;
	removeListener(event: Function, listener?: Function): void;

	removeListener(idOrEvent?: Listener | Function, listener?: Function) {
		if (!idOrEvent) {
			this._eventListeners.clear();
		} else if (typeof idOrEvent === 'object') {
			const id = idOrEvent;
			this.removeListener(id.event, id.listener);
		} else {
			const event = idOrEvent;

			if (this._eventListeners.has(event)) {
				if (listener) {
					const listeners = this._eventListeners.get(event)!;
					let idx = 0;
					while ((idx = listeners.indexOf(listener)) !== -1) {
						listeners.splice(idx, 1);
					}
				} else {
					this._eventListeners.delete(event);
				}
			}
		}
	}

	/**
	 * @typeparam T The event handler signature.
	 */
	registerEvent<T extends EventHandler<any[]>>() {
		const eventBinder = (handler: T): Listener => this.addListener(eventBinder, handler);

		return eventBinder;
	}

	/**
	 * Emit event. Calls all bound listeners with args.
	 */
	protected emit<Args extends any[]>(event: EventBinder<Args>, ...args: Args) {
		if (this._eventListeners.has(event)) {
			for (const listener of this._eventListeners.get(event)!) {
				listener(...args);
			}
		}
	}
}
