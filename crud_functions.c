// crud functions.

#include <stdio.h>
#include <stdlib.h>
#include "mytools.c"
#define size 30

const char menu_file_name[] = "menu.cfg";
const char fields_file_name[] = "field_names.cfg";
const char main_file_name[] = "details.dat";

char **field_names;
char *field_name, *value;
int  field_count;

int get_field_count();
void load_fields_into_array(char**);
int create();
int read();
// int update();
// int delete();

int main()
{
	int user_option = 1,choice;
	do
	{
		FILE *fp_menu;
		char text[size];
		fp_menu = fopen(menu_file_name, "r");
		while(fgets(text, size, fp_menu))
		{
			printf("%s", text);
		}
		scanf("%d", &choice);
		switch(choice)
		{
			case 1: create();
			break;
			case 2: read();
			break;
			// case 3: update();
			// break;
			// case 4: delete();
			// 	break;
			case 5: user_option = 0;
		}
	}while(user_option == 1);
}

int get_field_count()
{
	int field_counter;
	FILE *fp_field_names;
	fp_field_names = fopen(fields_file_name, "r");
	field_name = (char*)malloc(size);
	while(fgets(field_name, size, fp_field_names))
	{
		field_counter += 1;
	}
	fclose(fp_field_names);
	return field_counter;
}

void load_fields_into_array(char** field_names)
{
	int counter;
	FILE *fp_field_names;
	field_count = get_field_count();
	fp_field_names = fopen(fields_file_name, "r");
	for(counter = 0; counter < field_count; counter++)
	{
		field_names[counter] = (char*)malloc(size);
		fgets(field_names[counter], size, fp_field_names);
	}
	fclose(fp_field_names);
}

int create()
{
	field_count = get_field_count();
	int counter;
	field_names = (char**)malloc(field_count * sizeof(char*));
	load_fields_into_array(field_names);
	FILE *fp_main_details;
	fp_main_details = fopen(main_file_name, "a");
	for (counter = 0; counter < field_count; counter++)
	{
		removeNewLine(*(field_names + counter));
		printf("Enter %s: ", *(field_names + counter));
		fgets(value, size, stdin);
		removeNewLine(value);
		fputs(value, fp_main_details);
	}
	char status = 'A';
	fputc(status, fp_main_details);
	fclose(fp_main_details);
	return 1;
}

int read()
{
	char character;
	int counter;
	int field_count = get_field_count();
	field_names = (char**)malloc(field_count * sizeof(char*));
	load_fields_into_array(field_names);
	FILE *fp_main_details;
	fp_main_details = fopen(main_file_name, "r");
	for (counter = 0; counter < field_count; counter++)
	{
		removeNewLine(*(field_names + counter));
		printf("%s", *(field_names + counter));
	}
	while((character = getc(fp_main_details)) != EOF)
	{
		fseek(fp_main_details, -1L, SEEK_CUR);
		for (counter = 0; counter < field_count; counter++)
		{
			fgets(value, size, fp_main_details);
			fputs(value, stdout);
		}
		char status = fgetc(fp_main_details);
		printf("%c\n", status);
	}
}
