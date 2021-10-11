import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { debounce } from "lodash";
import ReactModal from 'react-modal';
import RatingComponent from "./components/Rating"
import "bootstrap/dist/css/bootstrap.min.css";
import Rating from "react-rating";

const UI_PARAMS_API_URL = "/params";
const TRANSLATE_API_URL = "/translate";
const EXAMPLE_API_URL = "/examples";
const RECORD_API_URL = "/record"
const DEBOUNCE_INPUT = 250;
const RANDOM_NUM_URL = "https://reqres.in/api/users/2"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "",
      input: "",
      buttonText: "Submit",
      description: "Description",
      showExampleForm: false,
      examples: {},
      currentDateTime: Date().toLocaleString(),
      demoID: "TESTID",
      logged: "",
      showModal: false,
      likes: 0,
      dislikes: 0,
      userRating: 11
    };

    // Bind the event handlers
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);  
  }

  componentDidMount() {
    // Call API for the UI params
    axios
      .get(UI_PARAMS_API_URL)
      .then(
        ({
          data: { placeholder, button_text, description, show_example_form }
        }) => {
          this.setState({
            input: placeholder,
            buttonText: button_text,
            description: description,
            showExampleForm: show_example_form
          });
          if (this.state.showExampleForm) {
            axios.get(EXAMPLE_API_URL).then(({ data: examples }) => {
              this.setState({ examples });
            });
          }
        }
      );
  }

  handleGetLikes () {
    this.setState({ likes: 50 })
  }

  handleGetDislikes () {
    this.setState({ dislikes: 25 })
  }

  handleOpenModal () {
    this.setState({ showModal: true })
  }

  updateExample(id, body) {
    axios.put(`${EXAMPLE_API_URL}/${id}`, body);
  }

 
  debouncedUpdateExample = debounce(this.updateExample, DEBOUNCE_INPUT);

  async handleCloseModal () {
    let postBody = {
      demoID: this.state.demoID,
      essay: this.state.input,
      mlScore: parseInt(this.state.output),
      userRating: this.state.userRating
    };
    
    const response = await axios.post(RECORD_API_URL, postBody);
    this.setState({ logged: true })
    this.setState({ showModal: false })
  }

  handleExampleChange = (id, field) => e => {
    const text = e.target.value;

    let body = { [field]: text };
    let examples = { ...this.state.examples };
    examples[id][field] = text;

    this.setState({ examples });
    this.debouncedUpdateExample(id, body);
  };

  handleUserRatingChange = (rating) => {
    this.setState({ userRating: rating }, () => {
      this.handleCloseModal()
      //console.log("Changing userRating state:" + this.state.userRating + "- Rating:" + rating)
    });
    console.log("Curretin userRating state:" + this.state.userRating)
  };

  handleExampleDelete = id => e => {
    e.preventDefault();
    axios.delete(`${EXAMPLE_API_URL}/${id}`).then(({ data: examples }) => {
      this.setState({ examples });
    });
  };


  handleExampleAdd = e => {
    e.preventDefault();
    axios.post(EXAMPLE_API_URL).then(({ data: examples }) => {
      this.setState({ examples });
    });
  };

  handleInputChange(e) {
    this.setState({ input: e.target.value });
  }

  async handleClick(e) {
    e.preventDefault();
    let body = {
      prompt: this.state.input
    };
    await axios.post(TRANSLATE_API_URL, body).then(({ data: { text } }) => {
      this.setState({ output: text });
    });
    // TESTING ENDPOINT
    // await axios.post(RANDOM_NUM_URL).then(({ data: { id } }) => {
    //   this.setState({ output: id });
    // });

    this.handleOpenModal()
  }

  render() {
    const showExampleForm = this.state.showExampleForm;
    return (
      <div>
        <head />
        <body style = {{ alignItems: "center", justifyContent: "center" }}>
          <div
            style = {{
              margin: "auto",
              marginTop: "80px",
              display: "block",
              maxWidth: "1000px",
              minWidth: "200px",
              width: "50%",
            }}
          >
            <ReactModal 
              style = {{
                overlay: {
                  margin: 'auto',
                  position: 'absolute',
                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                  borderRadius: "5px",
                  padding: "50px",
                },
                content: {
                  position: 'absolute',
                  top: "50%",
                  left: "50%",
                  marginTop: "-50px",
                  transform: "translate(-50%, -50%)",
                }
              }}
              isOpen={this.state.showModal}
              contentLabel="onRequestClose Example"
              //onRequestClose={this.handleCloseModal}
              shouldCloseOnOverlayClick={false}
              ariaHideApp={false}
            >
              <p style = {{textAlign: "center"}} >Your essay score:</p>
              <h2 style = {{textAlign: "center"}} > {this.state.output} </h2>
              <RatingComponent
                  updateLikedBands={ this.handleGetDislikes }
                  likes= { this.state.likes }
                  dislikes = { this.state.dislikes } 
                  initialRating = { parseInt(this.state.output) }
                  getUserRating = { this.handleUserRatingChange }
                  parentCallback =  { this.handleCloseModal }
              />
              <button onClick={this.handleCloseModal}>Grade another</button>
            </ReactModal>

            <Form onSubmit={this.handleClick}>
              <Form.Group controlId="formBasicEmail">
                {showExampleForm && (
                  <div>
                    <h4 style={{ marginBottom: "25px" }}>Examples</h4>
                    {Object.values(this.state.examples).map(example => (
                      <span key={example.id}>
                        <Form.Group
                          as={Row}
                          controlId={"formExampleInput" + example.id}
                        >
                          <Form.Label column="sm" lg={2}>
                            Example Input
                          </Form.Label>
                          <Col sm={20} >
                            <Form.Control
                              type="text"
                              as="input"
                              placeholder="Enter text"
                              value={example.input}
                              onChange={this.handleExampleChange(
                                example.id,
                                "input"
                              )}
                            />
                          </Col>
                          
                        </Form.Group>
                        <Form.Group
                          as={Row}
                          controlId={"formExampleOutput" + example.id}
                        >
                          <Form.Label column="sm" lg={2}>
                            Example Output
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              as="textarea"
                              placeholder="Enter text"
                              value={example.output}
                              onChange={this.handleExampleChange(
                                example.id,
                                "output"
                              )}
                            />
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Col sm={{ span: 10, offset: 2 }}>
                            <Button
                              type="button"
                              size="sm"
                              variant="danger"
                              onClick={this.handleExampleDelete(example.id)}
                            >
                              Delete example
                            </Button>
                          </Col>
                        </Form.Group>
                      </span>
                    ))}
                    <Form.Group as={Row}>
                      <Col sm={{ span: 10 }}>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={this.handleExampleAdd}
                        >
                          Add example
                        </Button>
                      </Col>
                    </Form.Group>
                  </div>
                )}
                <Form.Label>{this.state.description}</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  placeholder="Enter text"
                  value={this.state.input}
                  style = {{ height:'400px' }}
                  onChange={this.handleInputChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                {this.state.buttonText}
              </Button>
            </Form>
            {/* <div
              style={{
                textAlign: "center",
                margin: "20px",
                marginBottom: "100px",
                fontSize: "18pt"
              }}
            >
              {this.state.output}
            </div> */}
            <div
              style={{
                textAlign: "center",
                margin: "20px",
                fontSize: "12pt"
              }}
            >
            </div>
          </div>
        </body>
      </div>
    );
  }
}

export default App;
