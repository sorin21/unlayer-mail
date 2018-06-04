import React, { Component } from 'react';
import { render } from 'react-dom'
import EmailEditor from 'react-email-editor'
import classes from './app.css';
import axios from "axios";
var fs = require('fs')
var createHTML = require('create-html');
var FileSaver = require("file-saver");


class App extends Component {

  state = {
    template: {},
    html: '',
  };

  componentDidMount = () => {
    

    // try {
    //   const json = localStorage.getItem("template");
    //   const template = JSON.parse(json);
    //   console.log(this.editor);
    //   if (template) {
    //     this.setState(() => ({ template }));
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  componentDidUpdate(prevProps, prevState) {

    this.editor.exportHtml(data => {
      const { design, html } = data;
      const imageQR = `<table id="u_content_image_1" class="u_content_image" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap: break-word;padding:10px;" align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px; padding-left: 0px;" align="center">

                                    <img align="center" border="0" src="https://pro.easydoevents.com/evguiapp/assets/mosaico/templates/easydoevents/img/qrcode.png"
                                      alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 100px;"
                                      width="100">

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>`;
      const position = html.indexOf("</body>");
      const output = html.substr(0, position) + imageQR + html.substr(position);
      console.log(html);
    })
      // const json = JSON.stringify(this.state.template);
      // localStorage.setItem("template", json);
      console.log(this.editor);
      console.log("componentDidUpdate");

  }
  exportHtml = () => {
    this.editor.exportHtml(data => {
      const { design, html } = data;
      // const position = JSON.stringify(html).indexOf("body");
      // const imageQR = `<img align="center" border="0" src="https://pro.easydoevents.com/evguiapp/assets/mosaico/templates/easydoevents/img/qrcode.png"
      // alt = "Image" title = "Image" style = "outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 234px;" width = "234" >`
      const imageQR = `<table id="u_content_image_1" class="u_content_image" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap: break-word;padding:10px;" align="left">

                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px; padding-left: 0px;" align="center">

                                    <img align="center" border="0" src="https://pro.easydoevents.com/evguiapp/assets/mosaico/templates/easydoevents/img/qrcode.png"
                                      alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 100px;"
                                      width="100">

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>`;
      const position = html.indexOf("</body>");
      const output = html.substr(0, position) + imageQR + html.substr(position);
      console.log(html);
      // design.body.rows.map((row) => {
      //   row.imageQR;
      //   console.log("objectdsadsadasdd", row);
      // })
      
      const template = {
        eventId: 'ala bala portocala event id',
        subject: 'this is the subject',
        languageId: 2,
        templateType: 5,
        htmlTemplate: output,
        jsonTemplate: JSON.stringify(design),
      };
     

      axios
        .post("/getX", template)
        .then(response => {
          
          // console.log("response: ", response);
          this.setState(() => ({ html: "The Template was send!" }));
        })
        .catch(error => {
          // const position = JSON.stringify(html).indexOf("</body>");
          // const output = JSON.stringify(html).substr(0, position) + imageQR + JSON.stringify(html).substr(position);
          // console.log("html", output);
          
          this.setState(() => ({ html: "The Template was not send!" }));
        });
    });
  };


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

  previewHTML = () => {
    this.editor.exportHtml(data => {
      const { design, html } = data;
      const myHTML = html;
      // window.open(html, "myWindow", "width=800,height=700");

      const x = window.open("", "", "location=yes, menubar=yes, toolbar=yes, scrollbars=yes, resizable=yes, width=600, height=700");
      x.document.open();
      x.document.write(myHTML);
      x.document.close();
    })
  }

  render() {
    return <div classes={classes.mainContainer}>
        <h1>ReactJS Email Editor</h1>
        {this.state.html && <h3>
            <strong>Template status: {this.state.html}</strong>
          </h3>}
        <div className={classes.container}>
          <button onClick={this.exportHtml}>Export HTML</button>
          <button onClick={this.loadDesign}>Load HTML</button>

          <select>
            <option value="">Initial Email</option>
            <option value="">Redminder Email</option>
            <option value="">Recall Email</option>
            <option value="">QR Ticket Email</option>
            <option value="">After Event Email</option>
            <option value="">Reject Email</option>
            <option value="">Feedback Email</option>
          </select>
          <select className={classes.right}>
            <option value="">Romanian</option>
            <option value="">English</option>
            <option value="">French</option>
          </select>
          <button onClick={this.previewHTML}>See HTML</button>
        </div>

        <EmailEditor ref={editor => (this.editor = editor)} />
      </div>;
  }
}

export default App;