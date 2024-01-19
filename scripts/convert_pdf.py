import os
import PyPDF2

# Directory containing the PDF files
pdf_directory = './public/'

# Loop through each file in the directory
for filename in os.listdir(pdf_directory):
    # Check if the file is a PDF
    if filename.endswith('.pdf'):
        pdf_path = os.path.join(pdf_directory, filename)
        
        # Open the PDF file
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Extract base name and create a corresponding text file name
            base_name = os.path.splitext(filename)[0]
            text_file_name = f"./training/{base_name}.txt"

            # Prepare to write extracted text to the text file
            with open(text_file_name, 'w') as text_file:
                # Iterate over each page in the PDF
                for page in pdf_reader.pages:
                    # Extract text from the page
                    text = page.extract_text()
                    
                    # Append the text to the text file
                    text_file.write(text)
