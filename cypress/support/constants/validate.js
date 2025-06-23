import { generateRandom } from "../utlis/index";
import { Length255 } from "../constants/defaultvalue"
export const TCForInvalidEmail = [
	{
		email: "      @mail.com",
		description: "should show error message if email contains white space only before @"
	},
	{
		email: "abc   @mail.com",
		description: "should show error message if email contains white space between prefix and @"
	},
	{
		email: "@mail.com",
		description: "should show error message if email contains white space between prefix and @"
	},
	{
		email: "abc@      ",
		description: "should show error message if email contains only white space after @"
	},
	{
		email: "abc@",
		description: "should show error message if email is missing domain"
	},
	{
		email: "abc.com",
		description: "should show error message if email is missing @"
	},
	{
		email: "abc..def@mail.com",
		description: "Email format 'abc..def@mail.com'"
	},
	{
		email: ".abc@mail.com",
		description: "Email format '.abc@mail.com'"
	},
	{
		email: "abc.def@mail#archive.com",
		description: "Email format 'abc.def@mail#archive.com'"
	},
	{
		email: "abc.def@mail",
		description: "Email format 'abc.def@mail'"
	},
	{
		email: "abc.def@mail..com",
		description: "Email format 'abc.def@mail..com'"
	}

]

export const TCForInvaildPassword = [
	{
		password: "12345",
		description: 'Meet only the "have at least 1 number" condition: "12345"'
	},
	{
		password: "ABCDE",
		description: 'Meet only the "have at least 1 uppercase letter" condition: "ABCDE"'
	},
	{
		password: "!@#$%",
		description: 'Meet only the "have at least 1 special symbol" condition: "!@#$%"'
	},
	{
		password: 'Abc1@',
		description: 'Meet all 3 other conditions except the "have at least 6 characters": "Abc1@"'
	},
	// {
	// 	password: '             ',
	// 	description: 'Input all spacing'
	// },
	// {
	// 	password: '1             ',
	// 	description: 'Input spacing after character'
	// },
	// {
	// 	password: '             2',
	// 	description: 'Input spacing before character'
	// }
]
export const TCForVaildPassword = [
	{
		password: "abcdef",
		description: 'Meet only the "have at least 6 characters" condition "abcdef"'
	},
	{
		password: "abc123",
		description: 'Meet the "have at least 6 characters" and "have at least 1 number" conditions "abc123"'
	},
	{
		password: 'abcABC',
		description: 'Meet the "have at least 6 characters" and "have at least 1 uppercase letter" conditions "abcABC"'
	},
	{
		password: 'abc!@#"',
		description: 'Meet the "have at least 6 characters" and "have at least 1 special symbol" conditions "abc!@#"'
	},
	{
		password: 'abc1@D',
		description: 'Meet all conditions "abc1@D"'
	},
	{
		password: '1     2',
		description: 'Spacing at middle'
	},
	{
		password: 'abcdef             ',
		description: 'Input spacing end'
	},
	{
		password: '             abcdef',
		description: 'Input spacing begin'
	},
	{
		password: '             abcdef      ',
		description: 'Input spacing begin and end'
	}
]
export const ValidEmail = [
	`${generateRandom(3, 'string')}abc-@mail.cc`,
	`${generateRandom(3, 'string')}abc-@mail.com.vn`,
	`${generateRandom(3, 'string')}abc#def@mail.com`,
	`1${generateRandom(3, 'string')}abc.def@mail.c`,
	`1a${generateRandom(3, 'string')}abc@mail.cc`,
	`1a${generateRandom(3, 'string')}abc.def@mail.com`,
	`1a${generateRandom(3, 'string')}abc_def@mail.com`,
	`1a${generateRandom(3, 'string')}bc.def@mail-archive.com`,
	`               abc${generateRandom(3, 'string')}@gmail.com1`
]
export const ValidFullName = [
	{
		fullName: "John Lee",
		description: "Input all texts"
	},
	{
		fullName: "1235456",
		description: "Input all numbers"
	},
	{
		fullName: "John Lee 1234",
		description: "Input texts and numbers"
	},
	{
		fullName: "!@#$%^&*()_+*/",
		description: "Input special characters"
	},
	{
		fullName: Length255,
		description: "Input = 255 characters"
	}

]
export const PasswordLV0 = [
	{
		password: "abcde",
		description: "Not meet any conditions"
	},
	{
		password: "12345",
		description: 'Meet only the "have at least 1 uppercase letter" condition'
	},
	{
		password: "!@#$%",
		description: 'Meet only the "have at least 1 special symbol" condition'
	},
	{
		password: "Abc1@",
		description: 'Meet all 3 other conditions except the "have at least 6 characters"'
	}
]
export const PasswordLV1 = [
	{
		password: "abcdef",
		description: 'Meet only the "have at least 6 characters" condition'
	}
]
export const PasswordLV2 = [
	{
		password: "abc123",
		description: 'Meet the "have at least 6 characters" and "have at least 1 number" conditions'
	},
	{
		password: "abcABC",
		description: 'Meet the "have at least 6 characters" and "have at least 1 uppercase letter" conditions'
	},
	{
		password: "abc!@#",
		description: 'Meet the "have at least 6 characters" and "have at least 1 special symbol" conditions'
	}
]

export const PasswordLV3 = [
	{
		password: "ABC123",
		description: 'Meet 3 conditions including the "have at least 6 characters"'
	}
]
export const PasswordLV4 = [
	{
		password: "abc1@D",
		description: 'Meet all conditions'
	}
]
export const folder = 'cypress/fixtures/files/'
export const UnderValidFile = {
	name: '6.1MB.bin',
	location: `${folder}6.1MB.bin`,
}
export const ValidFile = {
	name: '6.2MB.bin',
	location: `${folder}6.2MB.bin`,
}
export const InValidFile = {
	name: '6.9MB.bin',
	location: `${folder}6.9MB.bin`,
}
export const UnderValidFile25MB = {
	name: '24MB.bin',
	location: `${folder}24MB.bin`,
}
export const ValidFile25MB = {
	name: '25MB.bin',
	location: `${folder}25MB.bin`,
}
export const InValidFile25MB = {
	name: '26MB.bin',
	location: `${folder}26MB.bin`,
}
export const UploadMultiFile = [
	{
		name: UnderValidFile.name,
		location: UnderValidFile.location
	},
	{
		name: ValidFile.name,
		location: ValidFile.location,
	},
	{
		name: InValidFile.name,
		location: InValidFile.location,
	}
]
export const UploadFileFormat = [
	{
		name: 'file.csv',
		location: `${folder}file.csv`
	},
	{
		name: 'file.jpg',
		location: `${folder}file.jpg`
	},
	{
		name: 'file.ods',
		location: `${folder}file.ods`
	},
	{
		name: 'file.pdf',
		location: `${folder}file.pdf`
	},
	{
		name: 'file.tsv',
		location: `${folder}file.tsv`
	},
	{
		name: 'file.png',
		location: `${folder}file.png`
	}
]
export const specialFile =[
	{
		name: '#00096358.docx',
		location: `${folder}#0000001.docx`
	},
	{
		name: '0000002#.docx',
		location: `${folder}0000002#.docx`
	},
	{
		name: '#000#0003#.docx',
		location: `${folder}#000#0003#.docx`
	},
	{
		name: '0000004..docx',
		location: `${folder}0000004..docx`
	},
	{
		name: '0.00000.5..docx',
		location: `${folder}0.00000.5..docx`
	},
	{
		name: '##000.0006...docx',
		location: `${folder}##000.0006...docx`
	},
	{
		name: '-0000007-.docx',
		location: `${folder}-0000007-.docx`
	}
]
export const formatFileName = (fileName) => {
	const maxLength = 96;
	if (fileName.length <= maxLength) {
		return fileName;
	}
	const front = fileName.slice(0, maxLength / 2);
	const back = fileName.slice(-maxLength / 2);
	return `${front}...${back}`;
};
