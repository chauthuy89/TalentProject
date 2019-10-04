/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { Button, Icon } from 'semantic-ui-react';

export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        const skillData = props.skillData.map(x => Object.assign({}, x));
        this.state = {
            showAdd: false,
            showEdit: false,
            skills: skillData,
            id: "",
            newSkill: {
                name: "",
                level: ""
            }
        }
        this.closeAdd = this.closeAdd.bind(this);
        this.openAdd = this.openAdd.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.updateSkill = this.updateSkill.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
    };


    componentDidMount() {
        $('.ui.button.address')
            .popup();
    }

    //functions for buttons
    addSkill() {
        let skills = this.props.skillData.map(x => Object.assign({}, x));
        skills.push(this.state.newSkill);

        this.setState({
            showAdd: false
        })

        this.props.updateProfileData({
            skills
        })
    }

    openAdd() {
        this.setState({
            showAdd: true,
            newSkill: {
                name: "",
                level: ""
            }
        })
    }

    closeAdd() {
        this.setState({
            showAdd: false
        })
    }
    openEdit(skill) {
        let data = Object.assign({}, skill);

        this.setState({
            showEdit: true,
            newSkill: data,
            id: data.id
        });
    }

    closeEdit() {
        this.setState({
            showEdit: false
        })
    }

    updateSkill(updatedSkill) {
        debugger;
        const skills = this.props.skillData.map(x => Object.assign({}, x));
        let index = skills.findIndex((e) => e.id === updatedSkill.id);
        console.log(index);

        skills[index].name = updatedSkill.name;
        skills[index].level = updatedSkill.level;

        this.setState({
            showEdit: false
        });

        this.props.updateProfileData({
            skills
        })

    }

    deleteSkill(skill) {
        const skills = this.props.skillData.map(x => Object.assign({}, x));
        let index = skills.findIndex((e) => e.id === skill.id);
        skills.splice(index, 1);

        this.props.updateProfileData({ skills });
    }

    handleChange() {
        debugger;
        let data = Object.assign({}, this.state.newSkill);
        data[event.target.name] = event.target.value;
        this.setState({
            newSkill: data
        });

    }


    renderAdd() {

        let showEdit = this.state.showEdit;
        const options = ["Beginner",
            "Intermediate",
            "Expert"
        ];

        const skillLevelOptions = options.map((x) => <option key={x} value={x}>{x}</option>);

        return (

            <div className='ui grid'>
                <div className="five wide column">
                    <input
                        name="name"
                        onChange={this.handleChange}
                        maxLength={20}
                        placeholder="Skill Name"
                        value={this.state.newSkill.name}
                    />
                </div>
                <div className="five wide column">
                    <select
                        name="level"
                        onChange={this.handleChange}
                        value={this.state.newSkill.level}
                    >
                        <option value="Skill Level">Skill Level</option>
                        {skillLevelOptions}
                    </select>
                </div>
                <div className="six wide column">

                    <button type="button" className="ui teal button" onClick={this.addSkill}>Add</button>
                    <button type="button" className="ui button" onClick={this.closeAdd}>Cancel</button>
                </div>

                {this.renderDisplay()}

            </div>

        )
    }

    renderDisplay() {

        return (<div className='ui sixteen wide column'>
            <table className="ui single line table">
                <thead>
                    <tr><th>Skill</th>
                        <th>Level</th>
                        <th>
                            <button type="button" className="ui right floated teal button" onClick={this.openAdd}><i className="add icon"></i>Add New</button>
                        </th>
                    </tr></thead>


                <tbody>
                    {this.renderSkillWithOrWithoutData()}

                </tbody>


            </table>
        </div>)
    }

    renderSkillWithOrWithoutData() {
        let skills = this.props.skillData;
        return (
            this.props.skillData[0]
                ?
                skills.map(skill => < SkillData openEdit={this.openEdit} key={skill.id}
                    showEdit={this.state.showEdit} closeEdit={this.closeEdit} skill={skill}
                    handleChange={this.handleChange} updateSkill={this.updateSkill}
                    deleteSkill={this.deleteSkill}
                    id={this.state.id}
                />)
                :
                <tr></tr>
        )
    }

    render() {

        return (
            this.state.showAdd ? this.renderAdd() : this.renderDisplay()
        )
    }
}


class SkillData extends React.Component {
    constructor(props) {
        super(props);
        const data = Object.assign({}, this.props.skill);
        this.state = {
            updatedSkill: data
        }

        this.handleChange = this.handleChange.bind(this);
    }


    handleChange() {
        debugger;
        let data = this.state.updatedSkill;
        data[event.target.name] = event.target.value;
        this.setState({
            updatedSkill: data
        });

    }

    render() {
        let showEdit = this.props.showEdit;
        let skill = this.props.skill;

        return (
            showEdit && (this.props.id === skill.id) ?
                <tr>
                    <td><input value={this.state.updatedSkill.name}
                        onChange={this.handleChange}
                        name="name"
                    /></td>
                    <td><input value={this.state.updatedSkill.level}
                        onChange={this.handleChange}
                        name="level"
                    /></td>
                    <td>
                        <button className="ui blue basic button" onClick={() => this.props.updateSkill(this.state.updatedSkill)}>Update</button>
                        <button className="ui red basic button" onClick={this.props.closeEdit}>Cancel</button></td>
                </tr>
                :
                <tr>
                    <td>{skill.name}</td>
                    <td>{skill.level}</td>
                    <td>
                        <Button icon className="ui right floated button" onClick={() => this.props.deleteSkill(skill)}>
                            <Icon name='close' />
                        </Button>
                        <Button icon className="ui right floated button" onClick={() => this.props.openEdit(skill)}>
                            <Icon name='pencil' />
                        </Button>
                    </td>
                </tr>
        )
    }
}

