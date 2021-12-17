import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Button, Label, Col, Row, Modal, ModalHeader, ModalFooter, ModalBody, Media, Card, CardBody, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, Form, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { fetchFeedback } from '../redux/ActionCreators';
import { connect } from 'react-redux';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);
const isNumber = (val) => !isNaN(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

const mapStateToProps = state => {
    return {
      feedbacks: state.feedbacks
    }
}

const mapDispatchToProps = (dispatch) => ({
  fetchFeedback: (page) => {dispatch(fetchFeedback(page))}
});

function RenderFeedback({ feedback }) {
    return(
        <Card>
            <CardBody className='col-12'>
                <CardText>
                    <p>{feedback.message}</p>
                    <p style={{float:'right'}}>-- {feedback.firstname} {feedback.lastname} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(feedback.updatedAt)))}</p>
                </CardText>
            </CardBody>
        </Card>
    );
}

function Feedback(props) {
    if(props.feedbacks.feedbacks.length > 0) {
        var feedbacks = props.feedbacks.feedbacks.map((feedback) => {
            return (
                <div key={feedback._id} className="col-10 m-1">
                    <RenderFeedback feedback={feedback} />
                </div>
            );
        });
    }
    else 
        feedbacks = <h3> No More Feedbacks </h3>

    if (props.feedbacks.isLoading) {
        return(
                <Loading />
        );
    }
    else if (props.feedbacks.errMess) {
        return(
            <div className="col-12"> 
                <h4>{props.feedbacks.errMess}</h4>
            </div>
        );
    }
    else {
        return (
            <Media list>
                {feedbacks}
            </Media>
        );
    }
};

class Contact extends Component {

    constructor(props) {
        console.log("Props",props);
        super(props);
        this.state = {
            isModalOpen: false,
            activePage: 1
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        console.log("Current State is: " + JSON.stringify(values));
        this.props.postFeedback(values);
        this.props.resetFeedbackForm();
    }

    handleToggle() {
        this.toggleModal();  
        this.setState({activePage : 1},
            this.fetch
        )
    }

    loadMore() {
        this.setState({activePage : this.state.activePage + 1},
            this.fetch
        )  
    }

    fetch = () => {
        console.log('Page: ',this.state.activePage)
        this.props.fetchFeedback(this.state.activePage)
    }

    render() {
        return(
            <React.Fragment>
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to='/home'>Home</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Contact Us</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>Contact Us</h3>
                            <hr />
                            <Button style={{float:'right', display: 'inline-block'}} outline onClick={this.handleToggle}> 
                                View Feedback
                            </Button>
                        </div>
                    </div>
                    <div className="row row-content">
                        <div className="col-12">
                        <h3>Location Information</h3>
                        </div>
                        <div className="col-12 col-sm-4 offset-sm-1">
                                <h5>Our Address</h5>
                                <address>
                                121, Clear Water Bay Road<br />
                                Clear Water Bay, Kowloon<br />
                                HONG KONG<br />
                                <i className="fa fa-phone"></i>: +852 1234 5678<br />
                                <i className="fa fa-fax"></i>: +852 8765 4321<br />
                                <i className="fa fa-envelope"></i>: <a href="mailto:confusion@food.net">confusion@food.net</a>
                                </address>
                        </div>
                        <div className="col-12 col-sm-6 offset-sm-1">
                            <h5>Map of our Location</h5>
                        </div>
                        <div className="col-12 col-sm-11 offset-sm-1">
                            <div className="btn-group" role="group">
                                <a role="button" className="btn btn-primary" href="tel:+85212345678"><i className="fa fa-phone"></i> Call</a>
                                <a role="button" className="btn btn-info"><i className="fa fa-skype"></i> Skype</a>
                                <a role="button" className="btn btn-success" href="mailto:confusion@food.net"><i className="fa fa-envelope-o"></i> Email</a>
                            </div>
                        </div>
                    </div>
                    <div className="row row-content">
                        <div className="col-12">
                            <h3>Send us Your Feedback</h3>
                        </div>
                        <div className="col-12 col-md-9">
                            <Form model="feedback" onSubmit={(values) => this.handleSubmit(values)}>
                                <Row className="form-group">
                                    <Label htmlFor="firstname" md={2}>First Name</Label>
                                    <Col md={10}>
                                        <Control.text model=".firstname" id="firstname" name="firstname"
                                            placeholder="First Name"
                                            className="form-control"
                                            validators={{
                                                required, minLength: minLength(3), maxLength: maxLength(15)
                                            }}
                                             />
                                        <Errors
                                            className="text-danger"
                                            model=".firstname"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                         />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="lastname" md={2}>Last Name</Label>
                                    <Col md={10}>
                                        <Control.text model=".lastname" id="lastname" name="lastname"
                                            placeholder="Last Name"
                                            className="form-control"
                                            validators={{
                                                required, minLength: minLength(3), maxLength: maxLength(15)
                                            }}
                                             />
                                        <Errors
                                            className="text-danger"
                                            model=".lastname"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                         />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="telnum" md={2}>Contact Tel.</Label>
                                    <Col md={10}>
                                        <Control.text model=".telnum" id="telnum" name="telnum"
                                            placeholder="Tel. Number"
                                            className="form-control"
                                            validators={{
                                                required, minLength: minLength(3), maxLength: maxLength(15), isNumber
                                            }}
                                             />
                                        <Errors
                                            className="text-danger"
                                            model=".telnum"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 2 numbers',
                                                maxLength: 'Must be 15 numbers or less',
                                                isNumber: 'Must be a number'
                                            }}
                                         />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="email" md={2}>Email</Label>
                                    <Col md={10}>
                                        <Control.text model=".email" id="email" name="email"
                                            placeholder="Email"
                                            className="form-control"
                                            validators={{
                                                required, validEmail
                                            }}
                                             />
                                        <Errors
                                            className="text-danger"
                                            model=".email"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                validEmail: 'Invalid Email Address'
                                            }}
                                         />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col md={{size: 6, offset: 2}}>
                                        <div className="form-check">
                                            <Label check>
                                                <Control.checkbox model=".agree" name="agree"
                                                    className="form-check-input"
                                                     /> {' '}
                                                    <strong>May we contact you?</strong>
                                            </Label>
                                        </div>
                                    </Col>
                                    <Col md={{size: 3, offset: 1}}>
                                        <Control.select model=".contactType" name="contactType"
                                            className="form-control">
                                            <option>Tel.</option>
                                            <option>Email</option>
                                        </Control.select>
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="message" md={2}>Your Feedback</Label>
                                    <Col md={10}>
                                        <Control.textarea model=".message" id="message" name="message"
                                            rows="12"
                                            className="form-control" />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col md={{size:10, offset: 2}}>
                                        <Button type="submit" color="primary">
                                        Send Feedback
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                    
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Feedbacks</ModalHeader>
                        <ModalBody style={{width:'100%'}}>
                            <Feedback feedbacks={this.props.feedbacks} />
                        </ModalBody>
                        <ModalFooter> 
                            <Button style={{float:'right'}} onClick={this.loadMore} > 
                                Load More
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </React.Fragment>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Contact);