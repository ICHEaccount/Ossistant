import React, { useState, useEffect } from 'react'
import { QuestionCircle } from 'react-bootstrap-icons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const Help = (props) => {
    const loc = props.location
    const [tips, settips] = useState(null)
    
    useEffect(() => {
        if(loc.startsWith('/casepage/')){
            const tip = () =>{
                return(
                    <p className='tw-text-left'>
                        Check Collected Item
                        Generate Visualization
                        Run OSINT tools
                    </p>
                )
            }
            settips(tip)
        }else{
            const tip = () =>{
                return(
                    <>
                        <strong>Start Case</strong> <br/>
                        <p className='tw-text-left'>
                        create a new case <br/>
                        choose an exist case
                        </p>
                    </>
                    
                )
            }
            settips(tip)
        }
    
    }, [])
    

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props} className='tw-text-left'>
            {tips}
        </Tooltip>
    );

    return (
    <div>
        <OverlayTrigger
        placement="left"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
        >   
        <QuestionCircle className='tw-inline-block tw-text-3xl tw-rounded-full tw-bg-black tw-text-white'/>
        </OverlayTrigger>
    </div>
    )
}

export default Help