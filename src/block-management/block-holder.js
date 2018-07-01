/**
 * @format
 * @flow
 */

import React from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback } from 'react-native';
import RCTAztecView from 'react-native-aztec';
import Toolbar from './toolbar';

import type { BlockType } from '../store/';

import styles from './block-holder.scss';

// Gutenberg imports
import { getBlockType } from '@gutenberg/blocks/api';
import { parse } from '@gutenberg/blocks';

type PropsType = BlockType & {
	onChange: ( uid: string, attributes: mixed ) => void,
	onToolbarButtonPressed: ( button: number, uid: string ) => void,
	onBlockHolderPressed: ( uid: string ) => void,
};
type StateType = {
	selected: boolean,
	focused: boolean,
	aztecheight: number,
};

const _minHeight = 50;

export default class BlockHolder extends React.Component<PropsType, StateType> {
	constructor( props: PropsType ) {
		super( props );
		this.state = {
			selected: false,
			focused: false,
			aztecheight: _minHeight,
		};
	}

	renderToolbarIfBlockFocused() {
		if ( this.props.focused ) {
			return (
				<Toolbar uid={ this.props.uid } onButtonPressed={ this.props.onToolbarButtonPressed } />
			);
		}

		// Return empty view, toolbar won't be rendered
		return <View />;
	}

	getBlockForType() {
		const blockType = getBlockType( this.props.name );
		if ( blockType ) {
			const Block = blockType.edit;

			let style;
			if ( blockType.name === 'core/code' ) {
				style = styles.block_code;
			}

			// TODO: setAttributes needs to change the state/attributes
			return (
				<Block
					attributes={ { ...this.props.attributes } }
					// pass a curried version of onChanged with just one argument
					setAttributes={ ( attrs ) => this.props.onChange( this.props.uid, attrs ) }
					isSelected={ this.props.focused }
					style={ style }
				/>
			);
		} else if ( this.props.name === 'aztec' ) {
			let isValidGB = false;
			try {
				const parsed = parse( this.props.attributes.content );

				isValidGB = parsed[ 0 ].isValid;
			} catch ( error ) {
				// nothing special here. Just have the resulting isValidGB be `false`
				// console.log( error );
			}

			const parseResultUi = isValidGB ? (
				<Text accessibilityLabel="parse-valid">Parse result: valid</Text>
			) : (
				<Text accessibilityLabel="parse-invalid">Parse result: invalid!</Text>
			);

			return (
				<View>
					<View>{ parseResultUi }</View>
					<TextInput
						accessibilityLabel="aztec-html"
						multiline={ true }
						value={ this.props.attributes.content }
					/>
					<RCTAztecView
						accessibilityLabel="aztec-view"
						style={ [
							styles[ 'aztec-editor' ],
							{ minHeight: Math.max( _minHeight, this.state.aztecheight ) },
						] }
						text={ { text: this.props.attributes.content } }
						onContentSizeChange={ ( event ) => {
							this.setState( { ...this.state, aztecheight: event.nativeEvent.contentSize.height } );
						} }
						onChange={ ( event ) => {
							this.props.onChange( this.props.uid, {
								...this.props.attributes,
								content: event.nativeEvent.text,
							} );
						} }
						color={ 'black' }
						maxImagesWidth={ 200 }
					/>
				</View>
			);
		}

		// Default block placeholder
		return <Text>{ this.props.attributes.content }</Text>;
	}

	render() {
		return (
			<TouchableWithoutFeedback
				onPress={ this.props.onBlockHolderPressed.bind( this, this.props.uid ) }
			>
				<View style={ styles.blockHolder }>
					<View style={ styles.blockTitle }>
						<Text>BlockType: { this.props.name }</Text>
					</View>
					<View style={ styles.blockContainer }>{ this.getBlockForType.bind( this )() }</View>
					{ this.renderToolbarIfBlockFocused.bind( this )() }
				</View>
			</TouchableWithoutFeedback>
		);
	}
}
