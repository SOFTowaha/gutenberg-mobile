/**
 * @format
 * @flow
 */

import React from 'react';
import {
	Platform,
	Switch,
	Text,
	View,
	FlatList,
	TextInput,
	KeyboardAvoidingView,
} from 'react-native';
import RecyclerViewList, { DataSource } from 'react-native-recyclerview-list';
import { WhitePortal } from 'react-native-portal';
import BlockHolder from './block-holder';
import { ToolbarButton } from './constants';

import type { BlockType } from '../store/';

import styles from './block-manager.scss';

// Gutenberg imports
import { getBlockType, serialize } from '@wordpress/blocks';

export type BlockListType = {
	onChange: ( clientId: string, attributes: mixed ) => void,
	focusBlockAction: string => mixed,
	moveBlockUpAction: string => mixed,
	moveBlockDownAction: string => mixed,
	deleteBlockAction: string => mixed,
	parseBlocksAction: string => mixed,
	blocks: Array<BlockType>,
	aztechtml: string,
	refresh: boolean,
};

type PropsType = BlockListType;
type StateType = {
	dataSource: DataSource,
	showHtml: boolean,
	html: string,
};

export default class BlockManager extends React.Component<PropsType, StateType> {
	_recycler = null;

	constructor( props: PropsType ) {
		super( props );
		this.state = {
			dataSource: new DataSource( this.props.blocks, ( item: BlockType ) => item.clientId ),
			showHtml: false,
			html: '',
		};
	}

	anyBlockFocused(): boolean {
		return this.props.blocks.some( ( block ) => {
			return block.focused;
		} );
	}

	onBlockHolderPressed( clientId: string ) {
		this.props.focusBlockAction( clientId );
	}

	getDataSourceIndexFromUid( clientId: string ) {
		for ( let i = 0; i < this.state.dataSource.size(); ++i ) {
			const block = this.state.dataSource.get( i );
			if ( block.clientId === clientId ) {
				return i;
			}
		}
		return -1;
	}

	static getDerivedStateFromProps( props: PropsType, state: StateType ) {
		if ( props.fullparse === true ) {
			return {
				...state,
				dataSource: new DataSource( props.blocks, ( item: BlockType ) => item.clientId ),
			};
		}
		// no state change necessary
		return null;
	}

	onToolbarButtonPressed( button: number, clientId: string ) {
		const dataSourceBlockIndex = this.getDataSourceIndexFromUid( clientId );
		switch ( button ) {
			case ToolbarButton.UP:
				this.state.dataSource.moveUp( dataSourceBlockIndex );
				this.props.moveBlockUpAction( clientId );
				break;
			case ToolbarButton.DOWN:
				this.state.dataSource.moveDown( dataSourceBlockIndex );
				this.props.moveBlockDownAction( clientId );
				break;
			case ToolbarButton.DELETE:
				this.state.dataSource.splice( dataSourceBlockIndex, 1 );
				this.props.deleteBlockAction( clientId );
				break;
			case ToolbarButton.SETTINGS:
				// TODO: implement settings
				break;
		}
	}

	serializeToHtml() {
		return this.props.blocks
			.map( ( block ) => {
				const blockType = getBlockType( block.name );
				if ( blockType ) {
					return serialize( [ block ] ) + '\n\n';
				} else if ( block.name === 'aztec' ) {
					return '<aztec>' + block.attributes.content + '</aztec>\n\n';
				}

				return '<span>' + block.attributes.content + '</span>\n\n';
			} )
			.reduce( ( prevVal, value ) => {
				return prevVal + value;
			}, '' );
	}

	parseHTML() {
		const { parseBlocksAction } = this.props;
		const { html } = this.state;
		parseBlocksAction( html );
	}

	componentDidUpdate() {
		// List has been updated, tell the recycler view to update the view
		this.state.dataSource.setDirty();
	}

	onChange( clientId: string, attributes: mixed ) {
		// Update datasource UI
		const index = this.getDataSourceIndexFromUid( clientId );
		const dataSource = this.state.dataSource;
		const block = dataSource.get( this.getDataSourceIndexFromUid( clientId ) );
		block.attributes = attributes;
		dataSource.set( index, block );
		// Update Redux store
		this.props.onChange( clientId, attributes );
	}

	render() {
		let list;
		if ( Platform.OS === 'android' ) {
			list = (
				<RecyclerViewList
					ref={ ( component ) => ( this._recycler = component ) }
					style={ styles.list }
					dataSource={ this.state.dataSource }
					renderItem={ this.renderItem.bind( this ) }
					ListEmptyComponent={
						<View style={ { borderColor: '#e7e7e7', borderWidth: 10, margin: 10, padding: 20 } }>
							<Text style={ { fontSize: 15 } }>No blocks :(</Text>
						</View>
					}
				/>
			);
		} else {
			// TODO: we won't need this. This just a temporary solution until we implement the RecyclerViewList native code for iOS
			list = (
				<FlatList
					style={ styles.list }
					data={ this.props.blocks }
					extraData={ this.props.refresh }
					keyExtractor={ ( item ) => item.clientId }
					renderItem={ this.renderItem.bind( this ) }
				/>
			);
		}

		return (
			<View style={ styles.container }>
				<View style={ { height: 30 } } />
				<View style={ styles.switch }>
					<Text>View html output</Text>
					<Switch
						activeText={ 'On' }
						inActiveText={ 'Off' }
						value={ this.state.showHtml }
						onValueChange={ this.handleSwitchEditor }
					/>
				</View>
				{ this.state.showHtml && this.renderHTML() }
				{ ! this.state.showHtml && list }
				<WhitePortal name="blockFormatToolbar" />
			</View>
		);
	}

	handleSwitchEditor = ( showHtml: boolean ) => {
		if ( showHtml ) {
			const html = this.serializeToHtml();
			this.handleHTMLUpdate( html );
		} else {
			this.parseHTML();
		}

		this.setState( { showHtml } );
	};

	handleHTMLUpdate = ( html: string ) => {
		this.setState( { html } );
	};

	renderItem( value: { item: BlockType, clientId: string } ) {
		return (
			<BlockHolder
				key={ value.clientId }
				onToolbarButtonPressed={ this.onToolbarButtonPressed.bind( this ) }
				onBlockHolderPressed={ this.onBlockHolderPressed.bind( this ) }
				onChange={ this.onChange.bind( this ) }
				focused={ value.item.focused }
				clientId={ value.clientId }
				{ ...value.item }
			/>
		);
	}

	renderHTML() {
		const behavior = Platform.OS === 'ios' ? 'padding' : null;
		return (
			<KeyboardAvoidingView style={ { flex: 1 } } behavior={ behavior }>
				<TextInput
					textAlignVertical="top"
					multiline
					numberOfLines={ 0 }
					style={ styles.htmlView }
					value={ this.state.html }
					onChangeText={ this.handleHTMLUpdate }
				/>
			</KeyboardAvoidingView>
		);
	}
}
