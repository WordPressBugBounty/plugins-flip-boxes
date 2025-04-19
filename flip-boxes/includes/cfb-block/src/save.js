import classnames from 'classnames' ;
/**
 * WordPress dependencies.
 */
import {
	InnerBlocks,
	RichText,
	useBlockProps
} from '@wordpress/block-editor';
import './style.scss';

const Save = ({
	attributes
}) => {
	const blockProps = useBlockProps.save({
		id: attributes.id,
		className: classnames(
			'anim',
			{
				'flipX': 'flipX' === attributes.animType,
				'flipY': 'flipY' === attributes.animType,
				'flipY-rev': 'flipY-rev' === attributes.animType,
				'flipX-rev': 'flipX-rev' === attributes.animType
			}
		)
	});
	return (
		<div { ...blockProps }>
			<div
				className={ classnames(
					'cfb-block-flip-inner'
				) }
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
						<RichText.Content
							className='cfb-block-front-title'
							tagName="h3"
							value={ attributes.title }
						/>

						<RichText.Content
							className='cfb-block-front-desc'
							tagName="p"
							value={ attributes.description }
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
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Save;
