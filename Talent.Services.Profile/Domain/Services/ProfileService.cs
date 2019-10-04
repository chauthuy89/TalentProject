using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            //Your code here;
            User profile = (await _userRepository.GetByIdAsync(Id));

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();
                var experience = profile.Experience.Select(x => ViewModelFromExperience(x)).ToList();
                var education = profile.Education.Select(x => ViewModelFromEducation(x)).ToList();
                var languages = profile.Languages.Select(x => ViewModelFromLanguage(x)).ToList();
                var certification = profile.Certifications.Select(x => ViewModelFromCertification(x)).ToList();
                var result = new TalentProfileViewModel
                {
                    Id = profile.Id,
                    Address = profile.Address,
                    Nationality = profile.Nationality,
                    Education = education,
                    Languages = languages,
                    Skills = skills,
                    Experience = experience,
                    Certifications = certification,
                    VisaStatus = profile.VisaStatus,
                    VisaExpiryDate = profile.VisaExpiryDate,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    LinkedAccounts = profile.LinkedAccounts,
                    JobSeekingStatus = profile.JobSeekingStatus,
                    Description = profile.Description,
                    Summary = profile.Summary,
                    Email = profile.Email,
                    FirstName = profile.FirstName,
                    LastName = profile.LastName,
                    Phone = profile.Phone,

                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            //Your code here;
            try
            {
                if (model.Id != null)
                {
                    User existingUser = await _userRepository.GetByIdAsync(model.Id);

                    existingUser.FirstName = model.FirstName;
                    existingUser.MiddleName = model.MiddleName;
                    existingUser.LastName = model.LastName;
                    existingUser.Gender = model.Gender;

                    existingUser.Email = model.Email;
                    existingUser.Phone = model.Phone;
                    existingUser.MobilePhone = model.MobilePhone;
                    existingUser.IsMobilePhoneVerified = model.IsMobilePhoneVerified;

                    existingUser.Address = model.Address;
                    existingUser.Nationality = model.Nationality;
                    existingUser.VisaStatus = model.VisaStatus;
                    existingUser.JobSeekingStatus = model.JobSeekingStatus;
                    existingUser.VisaExpiryDate = model.VisaExpiryDate;
                    existingUser.Summary = model.Summary;
                    existingUser.Description = model.Description;

                    existingUser.ProfilePhotoUrl = model.ProfilePhotoUrl;
                    existingUser.ProfilePhoto = model.ProfilePhoto;
                    existingUser.VideoName = model.VideoUrl;
                    existingUser.LinkedAccounts = model.LinkedAccounts;

                    var languages = new List<UserLanguage>();
                    foreach (var item in model.Languages)
                    {
                        var language = existingUser.Languages.FirstOrDefault(x => x.Id == item.Id);
                        if (language == null)
                        {
                            language = new UserLanguage
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false,
                            };
                        }
                        UpdateLanguageFromView(item, language);
                        languages.Add(language);
                    }

                    var skills = new List<UserSkill>();
                    foreach (var item in model.Skills)
                    {
                        var skill = existingUser.Skills.FirstOrDefault(x => x.Id == item.Id);
                        if (skill == null)
                        {
                            skill = new UserSkill
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false,
                            };
                        }
                        UpdateSkillFromView(item, skill);
                        skills.Add(skill);
                    }

                    var experiences = new List<UserExperience>();
                    foreach (var item in model.Experience)
                    {
                        var experience = existingUser.Experience.FirstOrDefault(x => x.Id == item.Id);
                        if (experience == null)
                        {
                            experience = new UserExperience
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                            };
                        }
                        UpdateExperienceFromView(item, experience);
                        experiences.Add(experience);
                    }

                    existingUser.Languages = languages;
                    existingUser.Skills = skills;
                    existingUser.Experience = experiences;
                    await _userRepository.Update(existingUser);
                    return true;

                }
                return false;

            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            //Your code here;
            var fileExtention = Path.GetExtension(file.FileName);
            List<String> acceptedExtions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtention != null && !acceptedExtions.Contains(fileExtention.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();
            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);
            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;
                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }
                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);
                await _userRepository.Update(profile);
                return true;
            }
            return false; ;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        //public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        //{
        //    //Your code here;
        //    IQueryable<User> users = _userRepository.Collection.Skip(position * increment).Take(increment);

        //    var returnTalents = new List<TalentSnapshotViewModel>();
        //    foreach (var user in users)
        //    {
        //        var skills = user.Skills.Select(x => ViewModelFromSkill(x).Name).ToList();
        //        var currentEmployment = GetCurrentExperience(user.Experience);

        //        var talent = new TalentSnapshotViewModel
        //        {
        //            Id = user.Id,
        //            Name = user.FirstName + " " + user.LastName,
        //            PhotoId = user.ProfilePhotoUrl,
        //            VideoUrl = user.VideoName,
        //            CVUrl = user.CvName,
        //            Summary = user.Summary,
        //            Level = user.JobSeekingStatus?.Status,
        //            CurrentEmployment = currentEmployment,
        //            Skills = skills
        //        };
        //        returnTalents.Add(talent);
        //    }
        //    return returnTalents;
        //}

        protected string GetCurrentExperience(List<UserExperience> experiences)
        {
            string currentEmployment = null;
            if (experiences.Count > 0)
            {
                var lastExperience = ViewModelFromExperience(experiences[experiences.Count - 1]);
                if (lastExperience.End >= DateTime.Now)
                    currentEmployment = lastExperience.Company + "," + lastExperience.Position;
            }
            return currentEmployment;
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateExperienceFromView(ExperienceViewModel model, UserExperience original)
        {
            original.Position = model.Position;
            original.Company = model.Company;
            original.Start = model.Start;
            original.End = model.End;
            original.Responsibilities = model.Responsibilities;
        }

        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.Language = model.Name;
            original.LanguageLevel = model.Level;

        }

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddEducationViewModel ViewModelFromEducation(UserEducation education)
        {
            return new AddEducationViewModel
            {
                Id = education.Id,
                Country = education.Country,
                Degree = education.Degree,
                Title = education.Title,
                InstituteName = education.InstituteName,
                YearOfGraduation = education.YearOfGraduation
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Id = language.Id,
                Level = language.LanguageLevel,
                Name = language.Language,
            };
        }

        protected AddCertificationViewModel ViewModelFromCertification(UserCertification certification)
        {
            return new AddCertificationViewModel
            {
                Id = certification.Id,
                CertificationFrom = certification.CertificationFrom,
                CertificationName = certification.CertificationName,
                CertificationYear = certification.CertificationYear
            };
        }

        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Position,
                End = experience.End,
                Position = experience.Position,
                Start = experience.Start,
                Responsibilities = experience.Responsibilities
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
