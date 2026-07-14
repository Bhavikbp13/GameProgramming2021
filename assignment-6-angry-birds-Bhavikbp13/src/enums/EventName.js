/**
 * The enum values are specifically referencing the Matter 
 * event names so please do not change the values here.
 *
 * https://brm.io/matter-js/docs/classes/MouseConstraint.html#events
 * https://brm.io/matter-js/docs/classes/Engine.html#events
 */

const EventName = {
	MouseMove: 'mousemove',
	MouseDragStart: 'startdrag',
	MouseDragEnd: 'enddrag',
	CollisionStart: 'collisionStart',
	CollisionEnd: 'collisionEnd',
};

export default EventName;
