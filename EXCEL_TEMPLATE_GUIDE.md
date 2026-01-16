# Excel Template Guide for Bulk Import

## Required Excel Format

Your Excel file MUST have these columns:

| Column Name | Required | Description |
|-------------|----------|-------------|
| **Title** | ✅ YES | The blog post title (REQUIRED) |
| H tags | Optional | Headings separated by semicolons (;) |
| keywords | Optional | Keywords separated by commas (,) |
| reference | Optional | Reference URLs separated by semicolons (;) |
| EEAT | Optional | Author info: `Author Name: John;Credentials: Expert;Experience: 5 years` |
| Date | Optional | Schedule date (YYYY-MM-DD) |
| Time | Optional | Schedule time (HH:MM) |

## Example Excel Content

| Title | H tags | keywords | reference |
|-------|--------|----------|-----------|
| Best Travel Destinations in India | Introduction;Top Places;Tips;Conclusion | travel, India, tourism | https://example.com |
| How to Make Biryani at Home | Ingredients;Steps;Tips | biryani, recipe, cooking | |
| Spider-Man Movie Review | Plot;Cast;Verdict | spider-man, marvel, movie | |

## Important Notes

1. **Title column is REQUIRED** - Without it, the import will fail
2. Column names are case-insensitive (Title, title, TITLE all work)
3. Save as .xlsx or .xls format
4. Each row = one blog post
5. Content will be 1500+ words automatically

## How to Use

1. Go to **Content Creation & Publishing**
2. Add your WordPress site first (if not added)
3. Click **Bulk Import** button
4. Select your WordPress site
5. Upload your Excel file
6. Click **Start Bulk Import**
7. Wait for processing (each post takes 30-60 seconds)

## Troubleshooting

### "No titles found in Excel file"
- Make sure you have a column named "Title" (not "Topic" or "Subject")
- Check that the column has data in it

### Content not generating
- Check server logs for errors
- Make sure API keys are configured in server/.env
- Try with a single title first to test

### Posts not publishing
- Verify WordPress credentials are correct
- Test connection in WordPress settings
- Check WordPress site is accessible
