/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { Button, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import moment from 'moment';

export default class Experience extends React.Component {
    constructor(props) {
        const experienceData = props.experienceData.map(x => Object.assign({}, x));
        super(props);
        this.state = {
            showEdit: false,
            showAdd: false,
            experiences: experienceData,
            newExperience: {
                id: 0,
                company: "",
                position: "",
                responsibilities: "",
                start: moment("2019-05-16T10:38:21.68Z"),
                end: moment()
            },
            id: 0
        };
        this.closeAdd = this.closeAdd.bind(this);
        this.openAdd = this.openAdd.bind(this);
        this.addExperience = this.addExperience.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.updateExperience = this.updateExperience.bind(this);
        this.addExperience = this.addExperience.bind(this);
        this.deleteExperience = this.deleteExperience.bind(this);

    };

    componentDidMount() {
        $('.ui.button.address')
            .popup();
    }

    //onchange handle functions
    handleChange() {
        let data = Object.assign({}, this.state.newExperience);
        data[event.target.name] = event.target.value;
        this.setState({
            newExperience: data
        })

    }



    //functions to control buttons

    openAdd() {
        let id = this.state.newExperience.id;
        this.setState({
            newExperience: {
                id: id + 1,
                company: "",
                position: "",
                responsibilities: "",
                start: moment(),
                end: moment()
            },
            showAdd: true
        })
    }

    closeAdd() {
        this.setState({
            showAdd: false
        })
    }

    openEdit(experience) {
        this.setState({
            showEdit: true,
            id: experience.id
        })
    }

    closeEdit() {
        this.setState({
            showEdit: false
        })
    }

    updateExperience(updatedExperience) {
        const experience = this.props.experienceData.map(x => Object.assign({}, x));
        let index = experience.findIndex((e) => e.id === updatedExperience.id);
        if (index != -1) {
            experience[index] = updatedExperience;
        }
        this.setState({
            showEdit: false
        });

        this.props.updateProfileData({
            experience
        });
    }

    addExperience(newExperience) {
        const experience = this.props.experienceData.map(x => Object.assign({}, x));
        experience.push(newExperience);
        this.setState({
            showAdd: false
        });
        this.props.updateProfileData({
            experience
        });
    }

    deleteExperience(deletedExperience) {
        const experience = this.props.experienceData.map(x => Object.assign({}, x));
        let index = experience.findIndex((e) => e.id === deletedExperience.id);
        if (index != -1) {
            experience.splice(index, 1);
        }
        this.props.updateProfileData({
            experience
        });


    }



    renderAdd() {
        let experience = this.state.newExperience;

        return (<div>
            <AddEditExperience
                experience={experience}
                buttonText="Save"
                addExperience={this.addExperience}
                closeEdit={this.closeAdd}
            />
            <br></br>
            {this.renderDisplay()}

        </div>)
    };

    renderDisplay() {
        let experiences = this.props.experienceData;
        return (
            <div className='ui sixteen wide column'>
                <table className='ui single line table'>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Position</th>
                            <th>Responsibilities</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>
                                <button type="button" className="ui right floated teal button" onClick={this.openAdd}><i className="add icon"></i>Add<br></br>New</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {experiences[0] ?
                            experiences.map(experience => <ExperienceData key={experience.id} experience={experience} closeEdit={this.closeEdit} openEdit={this.openEdit}
                                updateExperience={this.updateExperience} deleteExperience={this.deleteExperience} closeEdit={this.closeEdit}
                                showEdit={this.state.showEdit} id={this.state.id}
                            />) : <tr></tr>}

                    </tbody>

                </table>
            </div>)
    }



    render() {
        return (
            this.state.showAdd ? this.renderAdd() : this.renderDisplay()
        )
    }
}

class ExperienceData extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let showEdit = this.props.showEdit;
        let experience = Object.assign({}, this.props.experience);

        let editExperience = Object.assign({}, this.props.experience);
        editExperience.start = moment(experience.start);
        editExperience.end = moment(experience.end);
        let id = this.props.id;


        return (
            showEdit && (experience.id == id) ?
                <tr><td colSpan="6">
                    <AddEditExperience
                        buttonText="Update"
                        experience={editExperience}
                        addExperience={this.props.updateExperience}
                        closeEdit={this.props.closeEdit}
                    />
                </td>
                </tr>
                :
                <tr>
                    <td>{experience.company}</td>
                    <td>{experience.position}</td>
                    <td>{experience.responsibilities}</td>
                    <td>{experience.start.toString()}</td>
                    <td>{experience.end.toString()}</td>
                    <td>
                        <Button icon className="ui right floated button" onClick={() => this.props.deleteExperience(experience)}>
                            <Icon name='close' />
                        </Button>
                        <Button icon className="ui right floated button" onClick={() => this.props.openEdit(experience)}>
                            <Icon name='pencil' />
                        </Button>
                    </td>
                </tr>
        )
    }
}

class AddEditExperience extends React.Component {
    constructor(props) {
        super(props);
        const experience = Object.assign({}, props.experience);
        this.state = {
            newExperience: experience
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
    }

    //
    handleChangeDate(date, name) {
        let data = Object.assign({}, this.state.newExperience);
        data[name] = date;
        this.setState({
            newExperience: data
        })
    }

    handleChange() {
        let data = Object.assign({}, this.state.newExperience);
        data[event.target.name] = event.target.value;
        this.setState({
            newExperience: data
        })
    }

    render() {
        let experience = this.state.newExperience;
        return (<div className='ui grid'>
            <div className='eight wide column'>
                <div className="field">
                    <label>Company</label>
                    <input
                        type="text"
                        name="company"
                        value={experience.company}
                        onChange={this.handleChange}
                        maxLength={20}
                        placeholder="Company"
                    />
                </div>
            </div>
            <div className='eight wide column'>
                <div className="field">
                    <label>Position</label>
                    <input
                        type="text"
                        name="position"
                        value={experience.position}
                        onChange={this.handleChange}
                        maxLength={20}
                        placeholder="Position"
                    />
                </div>
            </div>
            <div className='eight wide column'>
                <div className='field'>
                    <label>Start Date:</label>
                    <DatePicker
                        selected={experience.start}
                        onChange={(date) => this.handleChangeDate(date, "start")}
                        minDate={moment()}
                    />
                </div>
            </div>
            <div className='eight wide column'>
                <div className='field'>
                    <label>End Date:</label>
                    <DatePicker
                        selected={experience.end}
                        onChange={(date) => this.handleChangeDate(date, "end")}
                        minDate={moment()}
                    />
                </div>
            </div>
            <div className='sixteen wide column'>
                <div className="field">
                    <label>Responsibilities</label>
                    <input
                        type="text"
                        name="responsibilities"
                        value={experience.responsibilities}
                        onChange={this.handleChange}
                        maxLength={200}
                        placeholder="Responsibilities"
                    />
                </div>
            </div>
            <div className="four wide column">
                <button type="button" className="ui teal button" onClick={() => this.props.addExperience(experience)}>{this.props.buttonText}</button>
                <button type="button" className="ui button" onClick={this.props.closeEdit}>Cancel</button>
            </div>
        </div>)
    }

}

