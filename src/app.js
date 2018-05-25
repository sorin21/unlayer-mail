import React, { Component } from 'react';
import { render } from 'react-dom'
import EmailEditor from 'react-email-editor'
import classes from './app.css';
import axios from "axios";


class App extends Component {

  state = {
    template: {},
    html: '',
  };

  componentDidMount = () => {
    try {
      const json = localStorage.getItem("template");
      const template = JSON.parse(json);

      if (template) {
        this.setState(() => ({ template }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  // componentDidUpdate(prevProps, prevState) {

  //     const json = JSON.stringify(this.state.template);
  //     localStorage.setItem("template", json);
  //     console.log("componentDidUpdate");

  // }
// DOUA SELECTURI: LIMBA SI EMAIL TYPE
  exportHtml = () => {
    this.editor.exportHtml(data => {
      const { design, html } = data;
      const template = {
        eventId: 'ala bala portocala event id',
        subject: 'this is the subject',
        languageId: 2,
        templateType: 5,
        htmlTemplate: html,
        jsonTemplate: JSON.stringify(design),
      }

      console.log('html', template);
      axios
        .post("/getX", template)
        .then(response => {
          console.log("response: ", response);
          this.setState(() => ({ html: "The Template was send!" }));
        })
        .catch(error => {
          this.setState(() => ({ html: "The Template was not send!" }));
        });
    });
  };

  saveHtml = () => {
    this.editor.exportHtml(data => {
      const { design, html } = data;
      this.setState(() => ({
        template: design,
        html: "The Template was saved!"
      }));
      const json = JSON.stringify(this.state.template);
      localStorage.setItem("template", json);
    });
  }

  loadDesign = () => {
    // const json = localStorage.getItem("template");
    // const template = JSON.parse(json);

    // this.editor.loadDesign(template);
    this.setState(() => ({ html: 'The Template was loaded in the Editor!'}));    
    axios.post('/takeJson')
      .then(response => {
        console.log("response: ", JSON.parse(JSON.stringify(response)));
        this.editor.loadDesign(response.data);
        this.setState(() => ({ html: "The Template was received!" }));
      })
      .catch(error => {
        this.setState(() => ({ html: "The Template was not received!" }));
        console.log("error from takeJson", error);
      });
  };

  render() {
    return <div classes={classes.mainContainer}>
        <h1>ReactJS Email Editor</h1>
        {this.state.html && <h3>
            <strong>Template status: {this.state.html}</strong>
          </h3>}
        <div className={classes.container}>
          <button onClick={this.saveHtml}>Save HTML</button>
          <button onClick={this.exportHtml}>Export HTML</button>
          <button onClick={this.loadDesign}>Load HTML</button>
        </div>

        <EmailEditor ref={editor => (this.editor = editor)} />
      </div>;
  }
}

export default App;