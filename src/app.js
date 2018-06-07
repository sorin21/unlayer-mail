import React, { Component } from 'react';
import { render } from 'react-dom'
import EmailEditor from 'react-email-editor'
import classes from './app.css';
import axios from "axios";
import alertify from "alertify.js";


class App extends Component {
  state = {
    template: {},
    status: 'Plese select an email template to preview!',
    type: null,
    html: null,
    json: null,
    value: ''
  };

  saveTemplate = () => {
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
      const template = {
        type: this.state.type,
        eventId: "ala bala portocala event id",
        subject: "this is the subject",
        languageId: 2,
        templateType: 5,
        html: output,
        json: JSON.stringify(design)
      };
      axios.post("/save", template)
        .then(response => {
          this.setState(() => ({ status: "The Template was saved!" }));
          alertify.success(this.state.status);
        })
        .catch(error => {
          this.setState(() => ({ status: "The Template was not saved!" }));
          alertify.error(this.state.status);
        });
    });
  };

  previewHTML = () => {
    alertify.error(this.state.status);
    if (this.state.html && this.state.html !== null) {
      this.setState(() => ({ status: "The Template was sent to be seen in pop up browser!" }));
      console.log('daa');
      alertify.success(this.state.status);
      const html = JSON.parse(JSON.stringify(this.state.html));
      const x = window.open("","","location=yes, menubar=yes, toolbar=yes, scrollbars=yes, resizable=yes, width=600, height=750");
      x.document.open();
      x.document.write(html);
      x.document.close();
    }
  };

  addSpaceBeforeUppercase = (str) => {
    for (var i = 0; i < str.length; i++) {
      if (str.charAt(i) === str.charAt(i).toUpperCase()) {
        // add a space before uppercase letter
        const newStr = str.replace(/([a-z])([A-Z])/g, "$1 $2");
        this.setState(() => ({ status: `The ${newStr} template was received!` }));
        return newStr;
      }
    }
  }

  emailSelectHandler = event => {
    const eventTarget = event.target.value;
    this.setState(() => ({ value: eventTarget }));
    axios.post("/takeJson/all")
      .then(response => {
        response.data.map(res => {
          if (this.state.value === res.type) {
            this.setState(() => ({ html: res.html }));
            this.setState(() => ({ json: res.json }));
            const str = res.type;
            this.setState(() => ({ type: str }));
            this.addSpaceBeforeUppercase(str);
            alertify.success(this.state.status);
            const json = JSON.parse(res.json);
            this.editor.loadDesign(json);
          }
        });
      })
      .catch(error => {
        const selectedOption = this.addSpaceBeforeUppercase(this.state.value);
        this.setState(() => ({ status: `The ${selectedOption} template was not received! ` }));
        alertify.error(this.state.status);
      });
  };

  render() {
    return (
      <div classes={classes.mainContainer}>
        <div className={classes.container}>
          <button onClick={this.saveTemplate}>Save</button>
          <select value={this.state.value} onChange={this.emailSelectHandler}>
            <option value="" disabled>
              Email Templates
            </option>
            <option value="InitialEmail">Initial Email</option>
            <option value="ReminderEmail">Reminder Email</option>
            <option value="RecallEmail">Recall Email</option>
            <option value="QrTicketEmail">QR Ticket Email</option>
            <option value="AfterEventEmail">After Event Email</option>
            <option value="RejectEmail">Reject Email</option>
            <option value="FeedbackEmail">Feedback Email</option>
          </select>
          <select className={classes.right}>
            <option value="">Romanian</option>
            <option value="">English</option>
            <option value="">French</option>
          </select>
          <button onClick={this.previewHTML}>Preview</button>
        </div>
        <EmailEditor ref={editor => (this.editor = editor)} />
      </div>
    );
  }
}

export default App;