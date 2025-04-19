

import iconList from './fa-icons.json';
import classnames from 'classnames' ;
import {
    useState,
    useEffect,
	Fragment
} from '@wordpress/element';

import {
	_px,
} from '../../helpers/helper-functions.js';


import { __ } from '@wordpress/i18n';

import {
	Dropdown,
	MenuGroup,
	MenuItem,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
	__experimentalUnitControl as UnitControl,
	ColorPalette
} from '@wordpress/components';

const FontAwesomeIconsList = ({
	i,
	icon,
	prefix,
	onToggle
}) => {
	return (
		<MenuItem
			label={ i.label }
			className={ classnames(
				{ 'is-selected': ( i.name === icon && i.prefix === prefix ) }
			) }
			onClick={ onToggle }
		>
			<i
				className={ classnames(
					i.prefix,
					`fa-${ i.name }`,
					'fa-fw'
				) }
			>
			</i>
			{/* { i.name } */}
		</MenuItem>
	);
};

const fontAwesomePicker=(props)=>{
    const label=props.label;
    const icon=props.iconObj?.name;
    const prefix=props.iconObj?.prefix;
    const setAttributes=props.setAttributes;
	const setAttr=props.attrName;
	const fontSizeLabel=props.fontSizeLabel;
	const fontSize=props.fontSize;
	const fontColorLabel=props.fontColorLabel;
	const fontColor=props.fontColor;
    useEffect( () => {
		const icons = [];

		Object.keys( iconList ).forEach( i => {
			Object.keys( iconList[i].styles ).forEach( o => {
				let prefix = '';

				switch ( iconList[i].styles[o]) {
				case 'brands':
					prefix = 'fab';
					break;
				case 'solid':
					prefix = 'fas';
					break;
				case 'regular':
					prefix = 'far';
					break;
				default:
					prefix = 'fas';
				}

				icons.push({
					name: i,
					unicode: iconList[i].unicode,
					prefix,
					label: iconList[i].label
				});
			});
		});

		setIcons( icons );
	}, []);

    const [ search, setSearch ] = useState( '' );
    const [ icons, setIcons ] = useState( null );

    const onSelectIcon = ( onToggle, i ) => {
		onToggle();
        const dataSet={prefix: i.prefix, name: `fa-${ i.name }`};
		const attr={};
		attr[setAttr]=dataSet;
        setAttributes( attr );
	};

    return (<Fragment>
		<ToolbarGroup className="cfb-block-icon-toolbar">
			<Dropdown
					key={label}
					contentClassName="cfb-icon-picker-popover"
					popoverProps={ { placement: 'top-start' } }
					renderToggle={ ({ isOpen, onToggle }) => (
						<ToolbarButton
							label={ __( 'Menu Icons', 'cfb-blocks' ) }
							className="cfb-block-icon-picker-btn"
							showTooltip
							onClick={ onToggle }
						>
							{ prefix && icon ? (
								<i
									className={ classnames(
										prefix,
										icon,
										'fa-fw'
									) }
								/>
							) : (
								<i className="fas fa-clock" />
							) }
						</ToolbarButton>
					) }
					renderContent={ ({ onToggle }) => (
						<MenuGroup label={label}>
							<TextControl
								value={ search }
								onChange={ e => setSearch( e ) }
							/>

							<div className="cfb-fontawesome-items">
								{ icons.map( (i,index )=> {
									if ( ! search || i.name.match( search.toLowerCase() ) || i.label.toLowerCase().match( search.toLowerCase() ) ) {
										return (
											<FontAwesomeIconsList
												key={ index }
												i={ i }
												icon={ icon }
												prefix={ prefix }
												onToggle={ () => onSelectIcon( onToggle, i ) }
											/>
										);
									}
								}) }
							</div>
						</MenuGroup>
					) }
				/>
		</ToolbarGroup>
		<div className="cfb-fontawesome-size-setting">
			<label className="cfb-fontawesome-setting-label">Icon Size</label>
		<UnitControl
			onChange={ sizeLabel => {
				const attr={};
				attr[fontSizeLabel]=sizeLabel;
				props.setAttributes(attr);
			} }
			isUnitSelectTabbable
			isResetValueOnUnitChange
			value={ _px( fontSize ) ?? fontSize }
			units={[
				{ value: 'px', label: 'px', default: 0 },
				{ value: 'em', label: 'em', default: 0 },
			]}
		/>
		</div>
		<label className="cfb-fontawesome-setting-label">Icon Color</label>
		<ColorPalette
			className="cfb-fontawesome-color-setting"
			value={fontColor}
			colors={ 
				[{name: 'default', color: fontColor}]
			}
			onChange={(v)=>{
				const attr={};
				attr[fontColorLabel] = v;
				setAttributes(attr);
			}}
		/>
	</Fragment>
	)
};

export default fontAwesomePicker;