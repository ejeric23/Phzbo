import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { Modal, Button, Form } from 'react-bootstrap';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';


const useStyles = makeStyles(theme => ({
    root: {
        height: 380,
    },
    speedDial: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
        color: "secondary"
    },
}));

const actions = [
    { icon: <AddIcon />, name: 'Post Property' },
    { icon: <ShareIcon />, name: 'Share' },
    { icon: <DeleteIcon />, name: 'Delete Property' },
];

export default function AddProperty(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [show, setShow] = useState(false);
    const [propertyImages, setPropertyPic] = useState([]);
    const [imageNumber, setImageNumber] = useState(0);

    const [address, setAddress] = useState('');
    const [zipCode, setZip] = useState('');
    const [askingPrice, setAskingPrice] = useState('');
    const [arv, setArv] = useState('');
    const [repairCost, setrepairCost] = useState('');
    const [sqrFt, setSqrFt] = useState('');
    const [comparableProp, setComparableProp] = useState('');
    const [description, setDescription] = useState('');

    const modalClose = () => setShow(false);
   
    const handleClick = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const openModel = () => {
        setShow(true);
        setOpen(prevOpen => !prevOpen);
    }

    const handleOpen = () => {
        if (!hidden) {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const checkUploadResult = (resultEvent) => {
        if (resultEvent.event === 'success') {
            propertyImages.push(resultEvent.info.secure_url);
        }
    }

    let widget = window.cloudinary.createUploadWidget({
        cloudName: 'dxtgsafec',
        uploadPreset: 'xpqy7emf',
        multiple: true
    }, (error, result) => checkUploadResult(result));

    const showWidget = (widget) => {
        widget.open();
    }

    const imageChecker = () => {
        setImageNumber(propertyImages.length)
    }

    const handleAddress = (event) => {
        const place = event.target.value;
        setAddress(place);
    }

    const handleZip = (event) => {
        const zip = event.target.value;
        setZip(zip);
    }

    const handleAskingPrice = (event) => {
        const price = event.target.value;
        setAskingPrice(price);
    }

    const handleArv = (event) => {
        const aRv = event.target.value;
        setArv(aRv);
    }

    const handleRepairCost = (event) => {
        const cost = event.target.value;
        setrepairCost(cost);
    }

    const handleSqrFt = (event) => {
        const demensions = event.target.value;
        setSqrFt(demensions);
    }

    const handleCompareProp = (event) => {
        const price = event.target.value;
        if(price[0] === '$'){
            setComparableProp(price.slice(1));
        } else {
            setComparableProp(price)
        }

    }

    const handleDescription = (event) => {
        const descriptionInfo = event.target.value;
        setDescription(descriptionInfo);
    }

    const submitProperty = async () => {
        const propCredentials = { address: `${address} ${zipCode}`, asking_price: askingPrice, arv: arv, repair_cost: repairCost, sqr_feet: sqrFt, comparable_prop: parseInt(comparableProp), description: description, userId: props.user.id};
        try {
        let propReponse = await axios.post('/listings', propCredentials);
        // console.log(propReponse.data.id);
            let listingId = propReponse.data.id;
            propertyImages.forEach(async (image) => {
                let imagesResponse = await axios.post('/images', { url: image, listingId: listingId});
                console.log(imagesResponse);
            });
        
        }
        catch {
        console.log("error")
        }
    }

    useEffect(()=> {
        setInterval(imageChecker, 3000);
    })

    return (
        <div className={classes.root}>
            <SpeedDial
                ariaLabel="Options"
                className={classes.speedDial}
                color="secondary" 
                hidden={hidden}
                icon={<SpeedDialIcon />}
                onBlur={handleClose}
                onClick={handleClick}
                onClose={handleClose}
                onFocus={handleOpen}
                onMouseEnter={handleOpen}
                onMouseLeave={handleClose}
                open={open}
            >
                <SpeedDialAction
                    key={actions[0].name}
                    icon={actions[0].icon}
                    tooltipTitle={actions[0].name}
                    tooltipOpen
                    onClick={openModel}
                />
                <SpeedDialAction
                    key={actions[1].name}
                    icon={actions[1].icon}
                    tooltipTitle={actions[1].name}
                    tooltipOpen
                    onClick={handleClick}
                />
                <SpeedDialAction
                    key={actions[2].name}
                    icon={actions[2].icon}
                    tooltipTitle={actions[2].name}
                    tooltipOpen
                    onClick={handleClick}
                />
            </SpeedDial>
            <Modal show={show} onHide={modalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Post your property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form.Control type="text" placeholder="Address" onChange={handleAddress}/>
                        <br />
                        <Form.Control type="text" placeholder="Zip Code" onChange={handleZip}/>
                        <br />
                        <Form.Control type="text" placeholder="Asking Price $" onChange={handleAskingPrice}/>
                        <br />
                        <Form.Control type="text" placeholder="ARV" onChange={handleArv}/>
                        <br />
                        <Form.Control type="text" placeholder="Repair Cost $" onChange={handleRepairCost}/>
                        <br />
                        <Form.Control type="text" placeholder="sqr ft" onChange={handleSqrFt}/>
                        <br />
                        <Form.Control type="text" placeholder="Comparable Prop $" onChange={handleCompareProp} />
                        <br />
                        <Form.Control type="text" placeholder="Description" onChange={handleDescription}/>
                        <br />
                    <Button onClick={() => showWidget(widget)}>Upload</Button><p>{imageNumber} images uploaded</p>
                </Modal.Body>
            
                <Modal.Footer>
                    <Button variant="secondary" onClick={modalClose}>
                        Close
          </Button>
                    <Button variant="primary" onClick={submitProperty}>
                        Post Property
          </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}