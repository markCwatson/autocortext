import JobsRepository, { JobsModel } from '@/repos/JobsRepository';
import { Activity, Job } from '@/types';
import { ObjectId } from 'mongodb';
import CompanyService from '@/services/CompanyService';
import ActivitiesService from './ActivitiesService';
import OpenAiService from './OpenAiService';

export interface metaDataModel {
  name: string;
  img: string;
  companyId: string;
  creatorId: string;
  machine: string;
}

export interface jobDetailsModel {
  title: string;
  description: string;
  severity: 'Severe' | 'High' | 'Medium' | 'Low';
}

class JobsService {
  static async create(
    details: jobDetailsModel,
    meta: metaDataModel,
  ): Promise<JobsModel | null> {
    const jobCount = await CompanyService.incrementJobCountByCompanyId(
      meta.companyId,
    );
    if (!jobCount) {
      return null;
    }

    const newJob: Job = {
      id: jobCount - 1,
      columnId: 'todo',
      ...details,
      machine: meta.machine,
      creatorId: meta.creatorId,
      companyId: meta.companyId,
    };

    const createdJob = await JobsRepository.create(newJob);
    if (!createdJob) {
      await CompanyService.decrementJobCountByCompanyId(meta.companyId);
      return null;
    }

    const createdActivity: Activity = {
      id: 1,
      type: 'created',
      person: {
        name: meta.name!,
        img: meta.img || '',
      },
      dateTime: new Date().toISOString(),
      jobId: createdJob._id,
    };

    const activity = await ActivitiesService.create(createdActivity);
    if (!activity) {
      await JobsRepository.delete(
        createdJob.id!,
        new ObjectId(createdJob.companyId),
      );
      await CompanyService.decrementJobCountByCompanyId(meta.companyId);
      return null;
    }

    return createdJob;
  }

  static async createFromConversation(
    conversation: string,
    meta: metaDataModel,
  ): Promise<JobsModel | null> {
    const jobDetails = await OpenAiService.generateJobDetails(conversation);
    if (!jobDetails) {
      return null;
    }

    const { title, description, severity } = this.parseInput(jobDetails);
    if (!title || !description) {
      return null;
    }

    let severityFormatted =
      severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();
    if (!['Severe', 'High', 'Medium', 'Low'].includes(severityFormatted)) {
      severityFormatted = 'Medium';
    }

    const jobCount = await CompanyService.incrementJobCountByCompanyId(
      meta.companyId,
    );
    if (!jobCount) {
      return null;
    }

    const newJob: Job = {
      id: jobCount - 1,
      columnId: 'todo',
      title,
      description,
      severity: severityFormatted as 'Severe' | 'High' | 'Medium' | 'Low',
      machine: meta.machine,
      creatorId: meta.creatorId,
      companyId: meta.companyId,
    };

    const createdJob = await JobsRepository.create(newJob);
    if (!createdJob) {
      await CompanyService.decrementJobCountByCompanyId(meta.companyId);
      return null;
    }

    const createdActivity: Activity = {
      id: 1,
      type: 'created',
      person: {
        name: meta.name!,
        img: meta.img || '',
      },
      dateTime: new Date().toISOString(),
      jobId: createdJob._id,
    };

    const activity = await ActivitiesService.create(createdActivity);
    if (!activity) {
      await JobsRepository.delete(
        createdJob.id!,
        new ObjectId(createdJob.companyId),
      );
      await CompanyService.decrementJobCountByCompanyId(meta.companyId);
      return null;
    }

    return createdJob;
  }

  static async getJobsByCompanyId(
    companyId: string,
  ): Promise<JobsModel[] | null> {
    return JobsRepository.getJobsByCompanyId(new ObjectId(companyId));
  }

  static async delete(id: number, companyId: string): Promise<Job> {
    return JobsRepository.delete(id, new ObjectId(companyId));
  }

  static async deleteByCompanyId(companyId: string): Promise<void> {
    return JobsRepository.deleteByCompanyId(new ObjectId(companyId));
  }

  static async update(job: JobsModel): Promise<JobsModel> {
    return JobsRepository.update(job);
  }

  static async countJobsByCompanyId(companyId: string): Promise<number | null> {
    return JobsRepository.countJobsByCompanyId(new ObjectId(companyId));
  }

  // Function to parse the input string using regex
  private static parseInput(input: string): {
    title: string;
    description: string;
    severity: string;
  } {
    // Define regex patterns for matching title, description, and severity
    const titlePattern = /(?:job title|title):\s*(.+)/i;
    const descriptionPattern = /description:\s*(.+)/i;
    const severityPattern = /severity:\s*(.+)/i;

    // Use regex to find matches
    const titleMatch = input.match(titlePattern);
    const descriptionMatch = input.match(descriptionPattern);
    const severityMatch = input.match(severityPattern);

    // Extract matched groups if matches are found, otherwise use empty strings
    const title = titleMatch ? titleMatch[1].trim() : 'Enter title here';
    const description = descriptionMatch
      ? descriptionMatch[1].trim()
      : 'Could not automatically generate title, description, and severity level. Please set manually.';
    const severity = severityMatch ? severityMatch[1].trim() : 'Medium';

    return { title, description, severity };
  }
}

export default JobsService;
