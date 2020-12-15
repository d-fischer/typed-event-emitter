import { Listener } from './Listener';

export type EventHandler<Args extends any[]> = (...args: Args) => void;
export type EventBinder<Args extends any[]> = (event: EventHandler<Args>) => Listener;

export class EventEmitter {
	private readonly _eventListeners = new Map<Function, Function[]>();
	private readonly _internalEventListeners = new Map<Function, Function[]>();

	on<Args extends any[]>(event: EventBinder<Args>, listener: EventHandler<Args>): Listener {
		return this._addListener(false, event, listener);
	}

	addListener<Args extends any[]>(event: EventBinder<Args>, listener: EventHandler<Args>): Listener {
		return this._addListener(false, event, listener);
	}

	removeListener(id: Listener): void;
	removeListener(event?: Function, listener?: Function): void;
	removeListener(idOrEvent?: Listener | Function, listener?: Function): void {
		this._removeListener(false, idOrEvent, listener);
	}

	registerEvent<T extends any[]>(): EventBinder<T> {
		const eventBinder = (handler: EventHandler<T>): Listener => this.addListener(eventBinder, handler);

		return eventBinder;
	}

	/** @internal */ removeInternalListener(id: Listener): void;
	/** @internal */ removeInternalListener(event?: Function, listener?: Function): void;
	/** @internal */ removeInternalListener(idOrEvent?: Listener | Function, listener?: Function): void {
		this._removeListener(true, idOrEvent, listener);
	}

	protected emit<Args extends any[]>(event: EventBinder<Args>, ...args: Args): void {
		if (this._eventListeners.has(event)) {
			for (const listener of this._eventListeners.get(event)!) {
				listener(...args);
			}
		}
	}

	protected registerInternalEvent<T extends any[]>(): EventBinder<T> {
		const eventBinder = (handler: EventHandler<T>): Listener => this.addInternalListener(eventBinder, handler);

		return eventBinder;
	}

	protected addInternalListener<Args extends any[]>(
		event: EventBinder<Args>,
		listener: EventHandler<Args>
	): Listener {
		return this._addListener(true, event, listener);
	}

	private _addListener<Args extends any[]>(
		internal: boolean,
		event: EventBinder<Args>,
		listener: EventHandler<Args>
	) {
		const listenerMap = internal ? this._eventListeners : this._internalEventListeners;
		if (listenerMap.has(event)) {
			listenerMap.get(event)!.push(listener);
		} else {
			listenerMap.set(event, [listener]);
		}

		return new Listener(this, event, listener, internal);
	}

	private _removeListener(internal: boolean, idOrEvent?: Listener | Function, listener?: Function): void {
		const listenerMap = internal ? this._eventListeners : this._internalEventListeners;
		if (!idOrEvent) {
			listenerMap.clear();
		} else if (typeof idOrEvent === 'object') {
			const id = idOrEvent;
			this.removeListener(id.event, id.listener);
		} else {
			const event = idOrEvent;

			if (listenerMap.has(event)) {
				if (listener) {
					const listeners = listenerMap.get(event)!;
					let idx = 0;
					while ((idx = listeners.indexOf(listener)) !== -1) {
						listeners.splice(idx, 1);
					}
				} else {
					listenerMap.delete(event);
				}
			}
		}
	}
}
