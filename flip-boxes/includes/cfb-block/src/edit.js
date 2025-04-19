/**
 * External dependencies
 */
import classnames from 'classnames' ;
import hexToRgba from 'hex-rgba';
import React, { Fragment } from 'react';

// editor style
import './editor.scss';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import {
    InnerBlocks,
    RichText,
    useBlockProps
} from '@wordpress/block-editor';

import {
    useState,
    useEffect
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Inspector from './inspector.js';
import { boxToCSS, getChoice, mergeBoxDefaultValues, stringToBox, _px } from './helpers/helper-functions.js';
    
import { isNumber } from 'lodash';

import WebfontLoader from "./components/typography/fontloader.js";

import {
    blockInit,
    useCSSNode
} from './helpers/block-utility.js';

const { attributes: defaultAttributes } = metadata;
/**
 * Flip component
 * @param props
 * @returns
 */
const Edit = ({
    attributes,
    setAttributes,
    clientId,
    isSelected,
}) => {
    useEffect( () => {
        // Set Flipbox Version for free to pro migration
        setAttributes({cfbBlockFlipboxVersion: 'free'});

        const unsubscribe = blockInit( clientId, defaultAttributes );
        return () => unsubscribe( attributes.id );
    }, [ attributes.id ]);
    const [ currentSide, setSide ] = useState( 'front' );

    // const { responsiveGetAttributes } = useResponsiveAttributes( setAttributes );

    const getShadowColor = () => {
        if ( attributes.boxShadowColor ) {
            if ( attributes.boxShadowColor.includes( '#' ) && attributes?.boxShadowColorOpacity && 0 <= attributes.boxShadowColorOpacity ) {
                return hexToRgba( attributes.boxShadowColor, attributes.boxShadowColorOpacity || 0.00001 );
            }
            return attributes.boxShadowColor;
        }
        return hexToRgba( '#000000', attributes.boxShadowColorOpacity !== undefined ? ( attributes.boxShadowColorOpacity || 0.00001 ) : 1 );
    };

    const inlineStyles = {
        '--cfb-block-editor-flip-animation':  'back' === currentSide ? 'var(--cfb-block-flip-anim)' : 'unset',
        '--cfb-block-width': isNumber( attributes.width ) ? _px( attributes.width ) : attributes?.width ?? '100%',
        '--cfb-block-height': isNumber( attributes.height ) ? _px( attributes.height ) : attributes?.height ?? '400px',
        '--cfb-block-border-width': attributes.borderWidth !== undefined && boxToCSS( mergeBoxDefaultValues(
            stringToBox( _px( attributes.borderWidth ) ),
            { left: '1px', right: '1px', bottom: '1px', top: '1px' }
        )  ),
        '--cfb-block-border-color': attributes.borderColor,
        '--cfb-block-border-radius': attributes.borderRadius !== undefined && boxToCSS( mergeBoxDefaultValues(
            stringToBox( _px( attributes.borderRadius ) ),
            { left: '10px', right: '10px', bottom: '10px', top: '10px' }
        )  ),
        '--cfb-block-front-background': getChoice([
            [ ( 'gradient' === attributes.frontBackgroundType && attributes.frontBackgroundGradient ), attributes.frontBackgroundGradient ],
            [ ( 'image' === attributes.frontBackgroundType && attributes.frontBackgroundImage?.url ), `url( ${ attributes.frontBackgroundImage?.url } ) ${ attributes.frontBackgroundRepeat || 'repeat' } ${ attributes.frontBackgroundAttachment || 'scroll' } ${ Math.round( attributes.frontBackgroundPosition?.x ?? 0.5 * 100 ) }% ${ Math.round( attributes.frontBackgroundPosition?.y ?? 0.5 * 100 ) }%/${ attributes.frontBackgroundSize || 'auto' }` ],
            [ attributes.frontBackgroundColor ]
        ]),
        '--cfb-block-back-background': getChoice([
            [ ( 'gradient' === attributes.backBackgroundType && attributes.backBackgroundGradient ), attributes.backBackgroundGradient ],
            [ ( 'image' === attributes.backBackgroundType && attributes.backBackgroundImage?.url ), `url( ${ attributes.backBackgroundImage?.url } ) ${ attributes.backBackgroundRepeat || 'repeat' } ${ attributes.backBackgroundAttachment || 'scroll' } ${ Math.round( attributes.backBackgroundPosition?.x ?? 0.5 * 100 ) }% ${ Math.round( attributes.backBackgroundPosition?.y ?? 0.5 * 100 ) }%/${ attributes.backBackgroundSize || 'auto' }` ],
            [ attributes.backBackgroundColor ]
        ]),
        '--cfb-block-box-shadow': attributes.boxShadow && `${ attributes.boxShadowHorizontal }px ${ attributes.boxShadowVertical }px ${ attributes.boxShadowBlur }px ${ getShadowColor() }`,
        '--cfb-block-front-vertical-align': attributes.frontVerticalAlign,
        '--cfb-block-front-horizontal-align': attributes.frontHorizontalAlign,
        '--cfb-block-front-text-align': attributes.frontTextAlign,
        '--cfb-block-back-text-align': attributes.backTextAlign,
        '--cfb-block-back-vertical-align': attributes.backVerticalAlign,
        '--cfb-block-back-horizontal-align': attributes.backHorizontalAlign,
        '--cfb-block-front-media-width': _px( attributes.frontMediaWidth ),
        '--cfb-block-front-media-height': _px( attributes.frontMediaHeight ),
        '--cfb-block-back-media-width': _px( attributes.backMediaWidth ),
        '--cfb-block-back-media-height': _px( attributes.backMediaHeight ),
        '--cfb-block-front-icon-size': _px( attributes.frontIconSize ),
        '--cfb-block-back-icon-size': _px( attributes.backIconSize ),
        '--cfb-block-front-icon-color': _px( attributes.frontIconColor ),
        '--cfb-block-back-icon-color': _px( attributes.backIconColor ),
        '--cfb-block-padding': boxToCSS( attributes?.padding ),
        '--cfb-block-padding-tablet': boxToCSS( attributes?.paddingTablet ),
        '--cfb-block-padding-mobile': boxToCSS( attributes?.paddingMobile ),
        '--cfb-block-front-title-font-family': attributes.frontTitleFontFamily,
        '--cfb-block-front-title-font-size': _px(attributes.frontTitleFontSize),
        '--cfb-block-front-title-line-height': _px(attributes.frontTitleLineHeight),
        '--cfb-block-front-title-font-weight': attributes.frontTitleFontWeight,
        '--cfb-block-back-title-font-family': attributes.backTitleFontFamily,
        '--cfb-block-back-title-font-size': _px(attributes.backTitleFontSize),
        '--cfb-block-back-title-line-height': _px(attributes.backTitleLineHeight),
        '--cfb-block-back-title-font-weight': attributes.backTitleFontWeight,
        '--cfb-block-front-desc-font-family': attributes.frontDescFontFamily,
        '--cfb-block-front-desc-font-size': _px(attributes.frontDescFontSize),
        '--cfb-block-front-desc-line-height': _px(attributes.frontDescLineHeight),
        '--cfb-block-front-desc-font-weight': attributes.frontDescFontWeight,
        '--cfb-block-back-desc-font-family': attributes.backDescFontFamily,
        '--cfb-block-back-desc-font-size': _px(attributes.backDescFontSize),
        '--cfb-block-back-desc-line-height': _px(attributes.backDescLineHeight),
        '--cfb-block-back-desc-font-weight': attributes.backDescFontWeight,
        '--cfb-block-title-color': attributes.titleColor,
        '--cfb-block-desc-color': attributes.descriptionColor,
    };

    const [ cssNodeName, setNodeCSS ] = useCSSNode();

    const blockProps = useBlockProps({

        // @ts-ignore
        id: attributes.id,
        className: classnames(
            {
                'flipX': 'flipX' === attributes.animType,
                'flipY': 'flipY' === attributes.animType,
                'flipY-rev': 'flipY-rev' === attributes.animType,
                'flipX-rev': 'flipX-rev' === attributes.animType
            },
            cssNodeName,
        ),
        style: inlineStyles
    });

    // google fonts frontTitleGoogleFont frontDescGoogleFont backTitleGoogleFont backDescGoogleFont
    // Improved code
    const googleFonts = [];
    const previousFont = [];
    ['front', 'back'].forEach(side => {
        ['Title', 'Desc'].forEach(element => {
            const attr = side + element + 'GoogleFont';
            if (attributes[attr]) {
                const fontConfig = {
                    google: {
                        families: [attributes[`${side + element}FontFamily`] + (attributes[`${side + element}FontWeight`] ? `:${attributes[`${side + element}FontWeight`]}` : '')],
                    }
                };
                const fontfamily = fontConfig?.google?.families[0];
                if (!previousFont.includes(fontfamily)) {
                    const googleFont = <WebfontLoader config={fontConfig}></WebfontLoader>;
                    googleFonts.push(googleFont);
                    previousFont.push(fontConfig?.google?.families[0]);
                }
            }
        });
    });
    
    const imageUrl=cfbBlockGutenbergObject.cfbBlockUrl + 'assets/images/flipbox-block-preview-one.gif';
    return (
            attributes.preview ? 
            <img src={imageUrl} width="100%"/>
            :
            <Fragment>
            <Inspector
                attributes={ attributes }
                setAttributes={ setAttributes }
                currentSide={ currentSide }
                setSide={ setSide }
            />
            {googleFonts.map((googleFont,key)=>{
                return <Fragment key={key}>{googleFont}</Fragment>
            })}
            <div { ...blockProps }>
                <div
                    className={
                        classnames(
                            'cfb-block-flip-inner'
                        )
                    }
                >
                    <div className="cfb-block-flip-front">
                        <div className="cfb-block-flip-content">
                            { ('image' === attributes.frontContentType && attributes.frontMedia?.url) && (
                                <img
                                    className="cfb-block-img"
                                    src={ attributes.frontMedia?.url }
                                />
                            ) }

                            {('icon' === attributes.frontContentType && attributes.frontIconData) &&
                            <div className='cfb-block-front-icon'>
                                <i className={classnames(
                                    attributes.frontIconData?.prefix,
                                    `${ attributes.frontIconData?.name }`,
                                    'fa-fw'
                                )}></i>
                            </div>
                            }

                            <RichText
                                className='cfb-block-front-title'
                                tagName="h3"
                                placeholder={ __( 'Enter Front Title', 'cfb-blocks' ) }
                                value={ attributes.title ?? '' }
                                onChange={ title => setAttributes({ title })}
                            />

                            <RichText
                                className='cfb-block-front-desc'
                                tagName="p"
                                placeholder={ __( 'Placeholder for flip box content visualization. Edit with your actual information.', 'cfb-blocks' ) }
                                value={ attributes.description ?? '' }
                                onChange={ description => setAttributes({ description })}
                            />
                        </div>
                    </div>

                    <div className="cfb-block-flip-back">
                        <div className="cfb-block-flip-content">
                            { ('image' === attributes.backContentType && attributes.backMedia?.url) && (
                                <img
                                    className="cfb-block-img"
                                    src={ attributes.backMedia?.url }
                                />
                            ) }

                            {('icon' === attributes.backContentType && attributes.backIconData) &&
                            <div className='cfb-block-back-icon'>
                                <i className={classnames(
                                    attributes.backIconData?.prefix,
                                    `${ attributes.backIconData?.name }`,
                                    'fa-fw'
                                )}></i>
                            </div>
                            }
                            <InnerBlocks
                                renderAppender={ isSelected ? InnerBlocks.DefaultBlockAppender : undefined }
                                template={[
                                    [ 'core/heading', {
                                        className: 'cfb-block-back-title',
                                        placeholder: __( 'Enter Back Title', 'cfb-blocks' ),
                                        level: 3
                                    }],
                                    [ 'core/paragraph', { className: 'cfb-block-back-desc',
                                        placeholder: __( 'Placeholder for flip box content visualization. Edit with your actual information.',
                                        'cfb-blocks' ),
                                        content: __( 'Substituted default content with your back description. Enhance design effortlessly in the Flipbox Block plugin for a professional touch.', 'cfb-blocks' ),
                                    }],
                                    [ 'core/buttons', {
                                        layout: { type: 'flex', justifyContent: 'center' },
                                        className: 'is-style-outline',
                                    },
                                    [[ 'core/button', { 
                                        className: 'is-style-fill cfb-block-back-btn is-style-outline',
                                        placeholder: __( 'Button text', 'cfb-blocks' ),
                                        text: __( 'Read More', 'cfb-blocks' ),
                                        textColor: 'white'
                                        // style: {spacing: {padding: {bottom: "var:preset|spacing|20", left: "var:preset|spacing|40", right: "var:preset|spacing|40", top: "var:preset|spacing|20"}}}
                                    }]]]
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Edit;

