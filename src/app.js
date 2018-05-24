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
        // console.log(template);
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

  exportHtml = () => {
    this.editor.exportHtml(data => {
      const { design, html } = data;
      // this.setState(() => ({ template: html }));
      const template = {
        htmlTemplate: html,
        jsonTemplate: JSON.stringify(design)
      }

      // JSON.stringify(template);
      console.log('html', template);
      // console.log("design", template.design);
       
      // console.log("html: ", htmlTemplate);
      axios
        .post("/getX", template)
        .then(response => {
          console.log("response: ", response);
          this.setState(() => ({ html: "The Template was send!" }));
        })
        .catch(error => {
          // console.log("error from post catch", JSON.parse(htmlTemplate));
          this.setState(() => ({ html: "The Template was not send!" }));
        });
    });
    // console.log("html: ", this.state.template);
    const post = {
      // eventId: "qsy6i66x3jun9sb4u0frznrh2", 
      // templateTypeId: 2,
      // templateTypeName: "reminder",
      // edit: "bgf14be",
      template: JSON.stringify(this.state.template)
    //   metadata: null,
    //   active: false,
    //   description: "reminder template liviu",
    //   languageId: 17
    };

   
    // axios
    //   .post("/getX", post)
    //   .then(response => {
    //     console.log("response: ", response);
    //     this.setState(() => ({ html: "The Template was send!" }));
    //   })
    //   .catch(error => {
    //     console.log("error from post catch", JSON.parse(post));
    //     this.setState(() => ({ html: "The Template was not send!" }));
    //   });
  };
  saveHtml = () => {
    this.editor.exportHtml(data => {
      const { design, html } = data;
      this.setState(() => ({
        template: html,
        html: "The Template was saved!"
      }));
      const json = JSON.stringify(this.state.template);
      localStorage.setItem("template", json);
      console.log("design", design);
    });
  }
  loadDesign = () => {
    const json = localStorage.getItem("template");
    const template = JSON.parse(json);

    this.editor.loadDesign(template);
    this.setState(() => ({ html: 'The Template was loaded in the Editor!'}));    
    // console.log("object", template);

    // axios
    //   .post("/getX", template)
    //   .then(response => {
    //     console.log("response: ", response);
    //     this.setState(() => ({ html: "The Template was send!" }));
    //     console.log("error from post catch", template);
        
    //   })
    //   .catch(error => {
    //     console.log("error from post catch", JSON.parse(template));
    //     this.setState(() => ({ html: "The Template was not send!" }));
    //   });
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