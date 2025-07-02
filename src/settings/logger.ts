import chalk from 'chalk'

// biome-ignore lint/suspicious/noExplicitAny: external developer decision
type LogParams = [message?: any, ...params: any[]]
function log(...params: LogParams) {
	return console.log(...params)
}

function success(...params: LogParams) {
	return log(chalk.green('✓'), ...params)
}
function warn(...params: LogParams) {
	return console.warn(chalk.yellow('▲'), ...params)
}
function error(...params: LogParams) {
	return console.error(chalk.red('✖︎'), ...params)
}

export const logger = {
	log,
	success,
	warn,
	error,
}
