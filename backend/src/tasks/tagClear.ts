import cron  from 'node-cron';
import Tag from '../model/TagSchema';


const tagClear = cron.schedule('0 0 * * *' , async () => {
	try {
		await Tag.deleteMany({}); 
		console.log('Tag database cleared successfully.');
	  } catch (error) {
		console.error('Error clearing the Tag database:', error);
	  }
})

export default tagClear; 