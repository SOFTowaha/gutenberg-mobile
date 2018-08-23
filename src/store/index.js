/**
 * @format
 * @flow
 */

// Gutenberg imports
import { registerCoreBlocks } from '@wordpress/block-library';
import {
	parse,
	registerBlockType,
	setUnknownTypeHandlerName,
} from '@wordpress/blocks';

import { createStore } from 'redux';
import { reducer } from './reducers';

import * as UnsupportedBlock from '../block-types/unsupported-block/';

export type BlockType = {
	clientId: string,
	name: string,
	isValid: boolean,
	attributes: Object,
	innerBlocks: Array<BlockType>,
	focused: boolean,
};

export type StateType = {
	blocks: Array<BlockType>,
	refresh: boolean,
};

registerCoreBlocks();
registerBlockType( UnsupportedBlock.name, UnsupportedBlock.settings );
setUnknownTypeHandlerName( UnsupportedBlock.name );

const initialHtml = `
<!-- wp:title -->
Hello World
<!-- /wp:title -->

<!-- wp:heading {"level": 2} -->
<h2>Welcome to Gutenberg</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><b>Hello</b> World!</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"dropCap":true,"backgroundColor":"vivid-red","fontSize":"large","className":"custom-class-1 custom-class-2"} -->
<p class="has-background has-drop-cap has-large-font-size has-vivid-red-background-color custom-class-1 custom-class-2">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tempor tincidunt sapien, quis dictum orci sollicitudin quis. Proin sed elit id est pulvinar feugiat vitae eget dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<!-- /wp:paragraph -->


<!-- wp:code -->
<pre class="wp-block-code"><code>if name == "World":
    return "Hello World"
else:
    return "Hello Pony"</code></pre>
<!-- /wp:code -->

<!-- wp:more -->
<!--more-->
<!-- /wp:more -->

<!-- wp:p4ragraph -->
Лорем ипсум долор сит амет, адиписци трацтатос еа еум. Меа аудиам малуиссет те, хас меис либрис елеифенд ин. Нец ех тота деленит сусципит. Яуас порро инструцтиор но нец.
<!-- /wp:p4ragraph -->
`;

const demoPost = `
<!-- wp:cover-image {"url":"https://cldup.com/Fz-ASbo2s3.jpg","align":"wide"} -->
<div class="wp-block-cover-image has-background-dim alignwide" style="background-image:url(https://cldup.com/Fz-ASbo2s3.jpg)"><p class="wp-block-cover-image-text">Of Mountains &amp; Printing Presses</p></div>
<!-- /wp:cover-image -->

<!-- wp:paragraph -->
<p>The goal of this new editor is to make adding rich content to WordPress simple and enjoyable. This whole post is composed of <em>pieces of content</em>—somewhat similar to LEGO bricks—that you can move around and interact with. Move your cursor around and you'll notice the different blocks light up with outlines and arrows. Press the arrows to reposition blocks quickly, without fearing about losing things in the process of copying and pasting.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>What you are reading now is a <strong>text block</strong>, the most basic block of all. The text block has its own controls to be moved freely around the post...</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"right"} -->
<p style="text-align:right">... like this one, which is right aligned.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Headings are separate blocks as well, which helps with the outline and organization of your content.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>A Picture is worth a Thousand Words</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Handling images and media with the utmost care is a primary focus of the new editor. Hopefully, you'll find aspects of adding captions or going full-width with your pictures much easier and robust than before.</p>
<!-- /wp:paragraph -->

<!-- wp:image {"align":"center"} -->
<figure class="wp-block-image aligncenter"><img src="https://cldup.com/cXyG__fTLN.jpg" alt="Beautiful landscape"/><figcaption>If your theme supports it, you'll see the "wide" button on the image toolbar. Give it a try.</figcaption></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Try selecting and removing or editing the caption, now you don't have to be careful about selecting the image or other text by mistake and ruining the presentation.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>The <em>Inserter</em> Tool</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Imagine everything that WordPress can do is available to you quickly and in the same place on the interface. No need to figure out HTML tags, classes, or remember complicated shortcode syntax. That's the spirit behind the inserter—the <code>(+)</code> button you'll see around the editor—which allows you to browse all available content blocks and add them into your post. Plugins and themes are able to register their own, opening up all sort of possibilities for rich editing and publishing.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Go give it a try, you may discover things WordPress can already add into your posts that you didn't know about. Here's a short list of what you can currently find there:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
	<li>Text &amp; Headings</li>
	<li>Images &amp; Videos</li>
	<li>Galleries</li>
	<li>Embeds, like YouTube, Tweets, or other WordPress posts.</li>
	<li>Layout blocks, like Buttons, Hero Images, Separators, etc.</li>
	<li>And <em>Lists</em> like this one of course :)</li>
</ul>
<!-- /wp:list -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading -->
<h2>Visual Editing</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>A huge benefit of blocks is that you can edit them in place and manipulate your content directly. Instead of having fields for editing things like the source of a quote, or the text of a button, you can directly change the content. Try editing the following quote:</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>The editor will endeavour to create a new page and post building experience that makes writing rich posts effortless, and has “blocks” to make it easy what today might take shortcodes, custom HTML, or “mystery meat” embed discovery.</p><cite>Matt Mullenweg, 2017</cite></blockquote>
<!-- /wp:quote -->

<!-- wp:paragraph -->
<p>The information corresponding to the source of the quote is a separate text field, similar to captions under images, so the structure of the quote is protected even if you select, modify, or remove the source. It's always easy to add it back.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Blocks can be anything you need. For instance, you may want to add a subdued quote as part of the composition of your text, or you may prefer to display a giant stylized one. All of these options are available in the inserter.</p>
<!-- /wp:paragraph -->

<!-- wp:gallery {"columns":2,"className":"alignnone"} -->
<ul class="wp-block-gallery columns-2 is-cropped alignnone"><li class="blocks-gallery-item"><figure><img src="https://cldup.com/n0g6ME5VKC.jpg" alt=""/></figure></li><li class="blocks-gallery-item"><figure><img src="https://cldup.com/ZjESfxPI3R.jpg" alt=""/></figure></li><li class="blocks-gallery-item"><figure><img src="https://cldup.com/EKNF8xD2UM.jpg" alt=""/></figure></li></ul>
<!-- /wp:gallery -->

<!-- wp:paragraph -->
<p>You can change the amount of columns in your galleries by dragging a slider in the block inspector in the sidebar.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Media Rich</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>If you combine the new <strong>wide</strong> and <strong>full-wide</strong> alignments with galleries, you can create a very media rich layout, very quickly:</p>
<!-- /wp:paragraph -->

<!-- wp:image {"align":"full"} -->
<figure class="wp-block-image alignfull"><img src="https://cldup.com/8lhI-gKnI2.jpg" alt="Accessibility is important don't forget image alt attribute"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>Sure, the full-wide image can be pretty big. But sometimes the image is worth it.</p>
<!-- /wp:paragraph -->

<!-- wp:gallery {"columns":2,"align":"wide"} -->
<ul class="wp-block-gallery alignwide columns-2 is-cropped"><li class="blocks-gallery-item"><figure><img src="https://cldup.com/_rSwtEeDGD.jpg" alt=""/></figure></li><li class="blocks-gallery-item"><figure><img src="https://cldup.com/L-cC3qX2DN.jpg" alt=""/></figure></li></ul>
<!-- /wp:gallery -->

<!-- wp:paragraph -->
<p>The above is a gallery with just two images. It's an easier way to create visually appealing layouts, without having to deal with floats. You can also easily convert the gallery back to individual images again, by using the block switcher.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Any block can opt into these alignments. The embed block has them also, and is responsive out of the box:</p>
<!-- /wp:paragraph -->

<!-- wp:core-embed/vimeo {"url":"https://vimeo.com/22439234","type":"video","providerNameSlug":"vimeo"} -->
<figure class="wp-block-embed-vimeo wp-block-embed is-type-video is-provider-vimeo">
https://vimeo.com/22439234
</figure>
<!-- /wp:core-embed/vimeo -->

<!-- wp:paragraph -->
<p>You can build any block you like, static or dynamic, decorative or plain. Here's a pullquote block:</p>
<!-- /wp:paragraph -->

<!-- wp:pullquote {"className":"alignnone"} -->
<blockquote class="wp-block-pullquote alignnone"><p>Code is Poetry</p><cite>The WordPress community</cite></blockquote>
<!-- /wp:pullquote -->

<!-- wp:paragraph {"align":"center"} -->
<p style="text-align:center"><em>If you want to learn more about how to build additional blocks, or if you are interested in helping with the project, head over to the <a href="https://github.com/WordPress/gutenberg">GitHub repository</a>.</em></p>
<!-- /wp:paragraph -->

<!-- wp:button {"align":"center"} -->
<div class="wp-block-button aligncenter"><a class="wp-block-button__link" href="https://github.com/WordPress/gutenberg">Help build Gutenberg</a></div>
<!-- /wp:button -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:paragraph {"align":"center"} -->
<p style="text-align:center">Thanks for testing Gutenberg!</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center"} -->
<p style="text-align:center">👋</p>
<!-- /wp:paragraph -->
`;
// const initialBlocks = parse( initialHtml );
const initialBlocks = parse( demoPost );

export const initialState: StateType = {
	// TODO: get blocks list block state should be externalized (shared with Gutenberg at some point?).
	// If not it should be created from a string parsing (commented HTML to json).
	blocks: initialBlocks.map( ( block ) => ( { ...block, focused: false } ) ),
	refresh: false,
};

const devToolsEnhancer =
	// ( 'development' === process.env.NODE_ENV && require( 'remote-redux-devtools' ).default ) ||
	() => {};

export function setupStore( state: StateType = initialState ) {
	const store = createStore( reducer, state, devToolsEnhancer() );
	return store;
}
