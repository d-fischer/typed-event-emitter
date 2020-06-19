import { Listener } from './Listener';

export type EventHandler<Args extends any[]> = (...args: Args) => void;
export type EventBinder<Args extends any[]> = (event: EventHandler<Args>) => Listener;

export class EventEmitter {
	private eventListeners: Map<Function, Function[]>;

	constructor() {
		this.eventListeners = new Map();
	}

	on<Args extends any[]>(event: EventBinder<Args>, listener: EventHandler<Args>) {
		if (this.eventListeners.has(event)) {
			this.eventListeners.get(event)!.push(listener);
		} else {
			this.eventListeners.set(event, [listener]);
		}

		return new Listener(this, event, listener);
	}

	addListener<Args extends any[]>(event: EventBinder<Args>, listener: EventHandler<Args>) {
		return this.on(event, listener);
	}

	removeListener(): void;
	removeListener(id: Listener): void;
	removeListener(event: Function, listener?: Function): void;

	removeListener() {
		if (arguments.length === 0) {
			this.eventListeners.clear();
		} else if (arguments.length === 1 && typeof arguments[0] === 'object') {
			const id = arguments[0];
			this.removeListener(id.event, id.listener);
		} else if (arguments.length >= 1) {
			const event = arguments[0] as Function;
			const listener = arguments[1] as Function;

			if (this.eventListeners.has(event)) {
				if (listener) {
					const listeners = this.eventListeners.get(event)!;
					let idx = 0;
					while ((idx = listeners.indexOf(listener)) !== -1) {
						listeners.splice(idx, 1);
					}
				} else {
					this.eventListeners.delete(event);
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
		if (this.eventListeners.has(event)) {
			for (const listener of this.eventListeners.get(event)!) {
				listener(...args);
			}
		}
	}
}
