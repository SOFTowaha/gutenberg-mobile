/** @format */

import ActionTypes from '../actions/ActionTypes';

export const reducer = ( state = {}, action ) => {
	switch ( action.type ) {
		case ActionTypes.BLOCK.FOCUS:
			var blocks = [ ...state.blocks ];
			const currentBlockState = blocks[ action.rowId ].focused;
			// Deselect all blocks
			for ( let block of blocks ) {
				block.focused = false;
			}
			// Select or deselect pressed block
			blocks[ action.rowId ].focused = ! currentBlockState;
			return { blocks: blocks, refresh: ! state.refresh };
		case ActionTypes.BLOCK.MOVE_UP:
			var blocks = [ ...state.blocks ];
			var tmp = blocks[ action.rowId ];
			blocks[ action.rowId ] = blocks[ action.rowId - 1 ];
			blocks[ action.rowId - 1 ] = tmp;
			return { blocks: blocks, refresh: ! state.refresh };
		case ActionTypes.BLOCK.MOVE_DOWN:
			var blocks = [ ...state.blocks ];
			var tmp = blocks[ action.rowId ];
			blocks[ action.rowId ] = blocks[ action.rowId + 1 ];
			blocks[ action.rowId + 1 ] = tmp;
			return { blocks: blocks, refresh: ! state.refresh };
		case ActionTypes.BLOCK.DELETE:
			var blocks = [ ...state.blocks ];
			blocks.splice( action.rowId, 1 );
			return { blocks: blocks, refresh: ! state.refresh };
		default:
			return state;
	}
};