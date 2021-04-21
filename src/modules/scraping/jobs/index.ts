import { InvoiceJobs } from '../dtos/jobs.dto';

export const getInvoice = {
	name: InvoiceJobs.getInvoice,
};

export const createPDf = {
	name: InvoiceJobs.createPdf,
};

export default [getInvoice, createPDf];
