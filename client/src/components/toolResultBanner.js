import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap';

const ToolResultBanner = (props) => {
    const toolState = props.toolState
    const error = props.error
    const [show, setShow] = useState(true);

    // console.log(toolState);
    switch (toolState) {
        case "completed":
            return(
            <Alert show={show} variant="success" >
                <Alert.Heading>Success</Alert.Heading>
                <p>
                    {/* {toolResult.newData?toolResult.newData:"But Nothing acquired"} */}
                </p>
                <div className="d-flex justify-content-end">
                    <Button  onClick={() => setShow(false)} variant="outline-success">
                    Got It
                    </Button>
                </div>
            </Alert>
            )
        // case "running":
        //     return(
        //         <Alert show={true} variant="light">
        //             Tool Running...
        //         </Alert>
        //         )
        case "error":
            return(
                <Alert show={show} variant="danger" dismissible>
                    Error Occured During Running Tools
                    <p>
                        {error?error:"Something went wrong:("}
                    </p>
                    <div className="d-flex justify-content-end">
                    <Button  onClick={() => setShow(false)} variant="outline-danger">
                    Got It
                    </Button>
                </div>
                </Alert>
                )
        default:
            return <></>;
    }
}

export default ToolResultBanner